const rust = import('../pkg/index');
const wasm = import('../pkg/index_bg.wasm')

const CELL_SIZE = 30;
const GRID_COLOR = "#000000";
const EMPTY_COLOR = "#ffffff";
const FILL_COLOR = "#F20505";


(async function () {
    let app = await rust
    let wasm_app = await wasm

    const grid = app.Grid.new()
    const height = grid.height()
    const width = grid.width()

    const canvas = document.getElementById("app")
    canvas.height = (CELL_SIZE + 1) * height + 1
    canvas.width = (CELL_SIZE + 1) * width + 1

    const ctx = canvas.getContext('2d')

    const drawGrid = () => {
        ctx.beginPath()
        ctx.strokeStyle = GRID_COLOR;

        //Vertical lines
        for (let i = 0; i <= width; i++) {
            ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0)
            ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1)
        }

        //Horizontal lines
        for (let y = 0; y <= width; y++) {
            ctx.moveTo(0, y * (CELL_SIZE + 1) + 1)
            ctx.lineTo(y * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * width + 1)
        }

        ctx.stroke();
    }

    const getIndex = (row, column) => {
        return row * width + column
    }

    const drawCells = () => {
        const cellsPtr = grid.cells()
        const cells = new Uint8Array(wasm_app.memory.buffer, cellsPtr, width * height)

        ctx.beginPath()

        const drawStateCells = (state, color) => {
            ctx.fillStyle = color
            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    const idx = getIndex(row, col)

                    if (cells[idx] !== state) {
                        continue
                    }

                    ctx.fillRect(
                        col * (CELL_SIZE + 1) + 1,
                        row * (CELL_SIZE + 1) + 1,
                        CELL_SIZE,
                        CELL_SIZE
                    )
                }
            }
        }

        drawStateCells(app.Cell.Empty, EMPTY_COLOR)
        drawStateCells(app.Cell.Fill, FILL_COLOR)

        ctx.stroke()
    }

    const renderLoop = () => {
        grid.tick();

        drawGrid();
        drawCells();

        const animationId = requestAnimationFrame(renderLoop)
        cancelAnimationFrame(animationId)
    }

    canvas.addEventListener('click', event => {
        const boundingRect = canvas.getBoundingClientRect();

        const canvasLeft = (event.clientX - boundingRect.left)
        const canvasTop = (event.clientY - boundingRect.top)

        const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1)
        const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1)

        if (grid.get_state(row, col)) {
            requestAnimationFrame(renderLoop)
        }
    })

    requestAnimationFrame(renderLoop)
})()