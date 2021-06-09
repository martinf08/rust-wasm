<script lang="typescript">
    import {afterUpdate, onMount} from "svelte";
    import init from "./pkg/index"
    const rust = import('./pkg/index');

    const CELL_SIZE = 31;
    const GRID_COLOR = "#000000";
    const EMPTY_COLOR = "#ffffff";
    const FILL_COLOR = "#F20505";

    afterUpdate(() => {
        const app = (async function () {
            let app = await rust
            console.log(app.wasm_memory().buffer)

            const grid = app.Grid.new()
            const height = grid.height()
            const width = grid.width()

            const canvas = await document.getElementById("app")
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
                const cells = new Uint8Array(app.wasm_memory().buffer, cellsPtr, width * height)

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

                if (grid.is_hitted(row, col)) {
                    requestAnimationFrame(renderLoop)
                }
            })

            requestAnimationFrame(renderLoop)
        })

        init().then(app)
    })

</script>

<style>
    :global(body) {
        background-color: #161923;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>

<canvas id="app"></canvas>
