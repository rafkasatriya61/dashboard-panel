document.write(`
<div id="overlay" onclick="toggleSidebar()"></div>
<div id="sidebar">
    <h2 style="color:var(--net-glow); margin-bottom:30px; font-size: 18px; display: flex; justify-content: space-between;">
        <span>👑 RafkaVL Menu</span>
        <span onclick="toggleSidebar()" style="cursor:pointer; color:#fff;">×</span>
    </h2>
    <div class="sidebar-links" id="sidebar-menu-list">
        <a href="index.html">📊 Dashboard Status</a>
        <a href="groups.html">👥 Manajemen Grup & Sewa</a>
        <a href="users.html">👤 User, Limit & Premium</a>
        <a href="settings.html">⚙️ Pengaturan Fitur Bot</a>
        <a id="auth-btn" style="margin-top:30px; border-top: 1px solid var(--border); padding-top: 15px; cursor: pointer; display: block; font-weight: bold;">Loading...</a>
    </div>
</div>
`);

function toggleSidebar() { 
    document.getElementById('sidebar').classList.toggle('active'); 
    document.getElementById('overlay').classList.toggle('active'); 
}

window.addEventListener('DOMContentLoaded', () => {
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '') currentPage = 'index.html'; 
    
    const menuLinks = document.querySelectorAll('#sidebar-menu-list a');
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) { link.classList.add('active'); }
    });

    const isAdmin = localStorage.getItem('rafkavl_token') === 'AUTH_VALID_2026';
    const authBtn = document.getElementById('auth-btn');
    
    if(authBtn) {
        if (isAdmin) {
            authBtn.innerHTML = '🔓 Logout Admin'; authBtn.style.color = 'var(--danger)';
            authBtn.onclick = () => { localStorage.removeItem('rafkavl_token'); window.location.reload(); };
        } else {
            authBtn.innerHTML = '🔒 Login Admin'; authBtn.style.color = 'var(--success)';
            authBtn.onclick = () => { window.location.href = 'login.html'; };
        }
    }
});

