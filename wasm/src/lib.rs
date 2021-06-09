use wasm_bindgen::prelude::*;
use js_sys::Math;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Debug, PartialEq, Eq, Copy, Clone)]
pub enum Cell {
    Empty = 0,
    Fill = 1,
}

impl Cell {
    fn is_fill(&self) -> bool {
        return match *self {
            Cell::Fill => true,
            _ => false,
        }
    }
}

#[wasm_bindgen]
pub struct Grid {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
}

impl Grid {
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }
}

#[wasm_bindgen]
impl Grid {
    pub fn new() -> Grid {
        let width: u32 = 16;
        let height: u32 = 16;

        Grid {
            width,
            height,
            cells: Vec::new(),
        }
    }

    pub fn tick(&mut self) {
        let generate_random = |min, max| -> usize {
            Math::floor(Math::random() * (max - min + 1) as f64 + min as f64) as usize
        };

        let random = generate_random(0, self.width * self.height);
        self.cells = (0..self.width * self.height)
            .map(|i| {
                if random as u32 == i {
                    Cell::Fill
                } else {
                    Cell::Empty
                }
            })
            .collect();
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }

    pub fn is_hitted(&self, row: u32, col: u32) -> bool {
        let idx = self.get_index(row, col);
        self.cells[idx].is_fill()
    }
}