const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1-MIjbxJc9Ak7EL7zqInPuMlC1jbx7-Ak/gviz/tq?tqx=out:json&tq=SELECT B, C";


fetch(SHEET_URL)
    .then(res => res.text())
    .then(text => {
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows.slice(1, 103); // B4:C103

        drawGrid(rows);
    });


function drawGrid(rows) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    let count = 1;
    rows.forEach(r => {
        // const nombre = r.c[1]?.v;
        const nombre = r.c[1].v;
        const cell = document.createElement("div");
        cell.className = "cell";

        if (nombre && nombre.toString().trim() !== "") {
            cell.classList.add("taken");
        }

        grid.appendChild(cell);
        count++;
    });
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  const rifa = document.querySelector(".rifa");

  html2canvas(rifa, {
    useCORS: true,
    scale: 2 // mejora la calidad
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "rifa_marcada.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
