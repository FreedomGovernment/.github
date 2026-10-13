#!/bin/bash
# FreeLawGen Backup System — rsync snapshots with hard links
# Robust, incremental backups to NAS without bloating disk usage
# Usage: ./backup.sh [target] [snapshot_name]
#   target: /home/astarcale/FreedomGovernment (default) or /home/astarcale/FreedomGovernment/McColloughVsPSU_/
#   snapshot_name: optional, defaults to date-based

set -euo pipefail

# Configuration
NAS_MOUNT="/mnt/MuhNAS/AStar"
BACKUP_BASE="${NAS_MOUNT}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_TODAY=$(date +%Y-%m-%d)
DAY_OF_WEEK=$(date +%u)  # 1=Monday, 7=Sunday
DAY_OF_MONTH=$(date +%d)

# Backup targets (space-separated list of directories)
BACKUP_TARGETS=(
    "/home/astarcale/FreedomGovernment"
    "/home/astarcale/FreedomGovernment/McColloughVsPSU_"
)

# Retention policy
KEEP_DAILY=7
KEEP_WEEKLY=4
KEEP_MONTHLY=12

# Log file
LOG_DIR="${BACKUP_BASE}/logs"
LOG_FILE="${LOG_DIR}/backup_${TIMESTAMP}.log"

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "${LOG_FILE}"
}

log_info() { log "INFO" "${GREEN}$*${NC}"; }
log_warn() { log "WARN" "${YELLOW}$*${NC}"; }
log_error() { log "ERROR" "${RED}$*${NC}"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check NAS mount
    if [ ! -d "${NAS_MOUNT}" ]; then
        log_error "NAS mount point not found: ${NAS_MOUNT}"
        exit 1
    fi
    
    # Check write access to NAS
    if [ ! -w "${NAS_MOUNT}" ]; then
        log_error "NAS mount point not writable: ${NAS_MOUNT}"
        exit 1
    fi
    
    # Check available space on NAS
    local available_kb
    available_kb=$(df -k "${NAS_MOUNT}" | tail -1 | awk '{print $4}')
    local available_gb=$((available_kb / 1024 / 1024))
    log_info "NAS available space: ${available_gb}GB"
    
    if [ "${available_gb}" -lt 100 ]; then
        log_warn "NAS has less than 100GB free space"
    fi
    
    # Create backup base directory if it doesn't exist
    mkdir -p "${BACKUP_BASE}"
    mkdir -p "${LOG_DIR}"
    
    log_info "Prerequisites check passed"
}

# Create a snapshot using rsync with hard links
create_snapshot() {
    local target=$1
    local snapshot_name=$2
    local snapshot_path="${BACKUP_BASE}/${snapshot_name}/${TIMESTAMP}"
    local target_dir=$(basename "${target}")
    
    log_info "Starting backup: ${target} -> ${snapshot_path}"
    
    # Create snapshot directory
    mkdir -p "${snapshot_path}"
    
    # Find the latest snapshot for hard linking (incremental backup)
    local latest_snapshot=""
    local prev_snapshot_dir="${BACKUP_BASE}/${snapshot_name}"
    
    if [ -d "${prev_snapshot_dir}" ]; then
        latest_snapshot=$(ls -1t "${prev_snapshot_dir}" | head -1)
        if [ -n "${latest_snapshot}" ]; then
            local link_dest="${prev_snapshot_dir}/${latest_snapshot}"
            log_info "Using link-dest from: ${link_dest}"
            
            # Run rsync with hard links for incremental backup
            rsync -avh --delete --link-dest="${link_dest}" \
                --exclude='.git' \
                --exclude='node_modules' \
                --exclude='__pycache__' \
                --exclude='*.pyc' \
                --exclude='*.pyo' \
                --exclude='*.swp' \
                --exclude='*.swo' \
                --exclude='*.tmp' \
                --exclude='*.bak' \
                --exclude='.DS_Store' \
                --exclude='Thumbs.db' \
                "${target}/" "${snapshot_path}/" 2>&1 | tee -a "${LOG_FILE}"
        else
            # No previous snapshot, do full backup
            rsync -avh --delete \
                --exclude='.git' \
                --exclude='node_modules' \
                --exclude='__pycache__' \
                --exclude='*.pyc' \
                --exclude='*.pyo' \
                --exclude='*.swp' \
                --exclude='*.swo' \
                --exclude='*.tmp' \
                --exclude='*.bak' \
                --exclude='.DS_Store' \
                --exclude='Thumbs.db' \
                "${target}/" "${snapshot_path}/" 2>&1 | tee -a "${LOG_FILE}"
        fi
    else
        # No previous snapshots, do full backup
        rsync -avh --delete \
            --exclude='.git' \
            --exclude='node_modules' \
            --exclude='__pycache__' \
            --exclude='*.pyc' \
            --exclude='*.pyo' \
            --exclude='*.swp' \
            --exclude='*.swo' \
            --exclude='*.tmp' \
            --exclude='*.bak' \
            --exclude='.DS_Store' \
            --exclude='Thumbs.db' \
            "${target}/" "${snapshot_path}/" 2>&1 | tee -a "${LOG_FILE}"
    fi
    
    # Verify backup integrity
    local source_size
    local backup_size
    source_size=$(du -sh "${target}" 2>/dev/null | awk '{print $1}')
    backup_size=$(du -sh "${snapshot_path}" 2>/dev/null | awk '{print $1}')
    
    log_info "Source size: ${source_size}"
    log_info "Backup size: ${backup_size}"
    
    # Count files
    local source_files
    local backup_files
    source_files=$(find "${target}" -type f 2>/dev/null | wc -l)
    backup_files=$(find "${snapshot_path}" -type f 2>/dev/null | wc -l)
    
    log_info "Source files: ${source_files}"
    log_info "Backup files: ${backup_files}"
    
    if [ "${source_files}" -ne "${backup_files}" ]; then
        log_warn "File count mismatch: source=${source_files}, backup=${backup_files}"
    fi
    
    log_info "Backup completed successfully: ${snapshot_path}"
}

# Clean up old snapshots based on retention policy
cleanup_old_snapshots() {
    local snapshot_name=$1
    local keep_count=$2
    local snapshot_dir="${BACKUP_BASE}/${snapshot_name}"
    
    if [ ! -d "${snapshot_dir}" ]; then
        log_info "No snapshots to clean for ${snapshot_name}"
        return
    fi
    
    log_info "Cleaning old snapshots for ${snapshot_name} (keeping ${keep_count})"
    
    # Get list of snapshots sorted by date (newest first)
    local snapshots
    snapshots=$(ls -1t "${snapshot_dir}")
    local count=0
    
    for snapshot in ${snapshots}; do
        count=$((count + 1))
        if [ ${count} -gt ${keep_count} ]; then
            log_info "Removing old snapshot: ${snapshot}"
            rm -rf "${snapshot_dir}/${snapshot}"
        fi
    done
    
    log_info "Cleanup completed for ${snapshot_name}"
}

# Main backup process
main() {
    log_info "=========================================="
    log_info "FreeLawGen Backup System Starting"
    log_info "Timestamp: ${TIMESTAMP}"
    log_info "=========================================="
    
    # Check prerequisites
    check_prerequisites
    
    # Create snapshots for each target
    for target in "${BACKUP_TARGETS[@]}"; do
        if [ ! -d "${target}" ]; then
            log_warn "Target directory not found, skipping: ${target}"
            continue
        fi
        
        local target_name=$(basename "${target}")
        
        # Daily snapshot
        create_snapshot "${target}" "daily"
        
        # Weekly snapshot (on Sundays)
        if [ "${DAY_OF_WEEK}" -eq 7 ]; then
            create_snapshot "${target}" "weekly"
        fi
        
        # Monthly snapshot (on 1st of month)
        if [ "${DAY_OF_MONTH}" -eq "01" ]; then
            create_snapshot "${target}" "monthly"
        fi
    done
    
    # Clean up old snapshots
    cleanup_old_snapshots "daily" "${KEEP_DAILY}"
    cleanup_old_snapshots "weekly" "${KEEP_WEEKLY}"
    cleanup_old_snapshots "monthly" "${KEEP_MONTHLY}"
    
    log_info "=========================================="
    log_info "Backup System Completed Successfully"
    log_info "=========================================="
}

# Run main function
main "$@"
