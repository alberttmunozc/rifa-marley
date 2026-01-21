const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1-MIjbxJc9Ak7EL7zqInPuMlC1jbx7-Ak/gviz/tq?tqx=out:json&tq=SELECT B, C";

const downloadBtn = document.getElementById("downloadBtn");
const originalBtnHTML = downloadBtn.innerHTML;

/**
 * Carga datos y dibuja la grilla
 */
async function loadAndDrawGrid() {
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows.slice(1, 101);

    drawGrid(rows);
}

/**
 * Dibuja las X
 */
function drawGrid(rows) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    rows.forEach(r => {
        const nombre = r.c[1]?.v;
        const cell = document.createElement("div");
        cell.className = "cell";

        if (nombre && nombre.toString().trim() !== "") {
            cell.classList.add("taken");
        }

        grid.appendChild(cell);
    });
}

/**
 * Descargar imagen (con loading)
 */
downloadBtn.addEventListener("click", async () => {
    try {
        // 🔒 bloquear botón + loading
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generando imagen...`;

        // 🔄 refrescar datos
        await loadAndDrawGrid();

        // ⏳ asegurar repaint
        await new Promise(resolve => setTimeout(resolve, 120));

        const rifa = document.querySelector(".rifa");

        const canvas = await html2canvas(rifa, {
            useCORS: true,
            scale: 2
        });

        const link = document.createElement("a");
        link.download = "rifa_marcada.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (error) {
        console.error("Error al generar la imagen:", error);
        alert("Ocurrió un error al generar la imagen");
    } finally {
        // ⏳ pequeño delay para mejor UX
        setTimeout(() => {
            // 🔓 restaurar botón
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalBtnHTML;
        }, 500);
    }
});

/**
 * Carga inicial
 */
loadAndDrawGrid();
