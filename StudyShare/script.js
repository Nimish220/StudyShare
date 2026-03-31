document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.querySelector('.drop-area');
    const fileInput = document.getElementById('fileInput');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const fileList = document.getElementById('file-list');
    const statusMsg = document.getElementById('upload-status');

    // Load initial files
    fetchFiles();

    // 1. Drag & Drop Visuals
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) handleUpload(files[0]);
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) handleUpload(fileInput.files[0]);
    });

    // 2. Upload Logic
    function handleUpload(file) {
        statusMsg.textContent = "Uploading " + file.name + "...";
        
        const formData = new FormData();
        formData.append('file', file);

        fetch('upload.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            statusMsg.textContent = data.message;
            statusMsg.style.color = data.success ? 'green' : 'red';
            if (data.success) {
                fetchFiles(); // Refresh list
            }
        })
        .catch(err => {
            console.error(err);
            statusMsg.textContent = "Upload failed.";
        });
    }

    // 3. Search & Filter Logic
    function fetchFiles() {
        const query = searchInput.value;
        const type = typeFilter.value;

        fetch(`search.php?q=${query}&type=${type}`)
        .then(res => res.json())
        .then(data => {
            renderFiles(data);
        });
    }

    function renderFiles(files) {
        fileList.innerHTML = '';
        if (files.length === 0) {
            fileList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-file"></i>
                    <p>No files found</p>
                </div>`;
            return;
        }

        files.forEach(file => {
            const size = (file.filesize / 1024).toFixed(1) + ' KB';
            const iconClass = getIcon(file.filetype);
            
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = `
                <div class="file-info">
                    <i class="${iconClass} file-icon"></i>
                    <div>
                        <strong>${file.filename}</strong><br>
                        <span class="small-text">${size} • ${file.upload_date}</span>
                    </div>
                </div>
                <a href="${file.filepath}" class="download-link" download>Download</a>
            `;
            fileList.appendChild(item);
        });
    }

    function getIcon(type) {
        if (type === 'pdf') return 'fa-solid fa-file-pdf';
        if (type === 'docx') return 'fa-solid fa-file-word';
        if (['jpg', 'png', 'jpeg'].includes(type)) return 'fa-solid fa-file-image';
        return 'fa-solid fa-file';
    }

    // Event Listeners for Search
    searchInput.addEventListener('input', fetchFiles);
    typeFilter.addEventListener('change', fetchFiles);
});