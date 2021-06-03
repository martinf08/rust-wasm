use wasm_bindgen::prelude::*;
use js_sys::Math;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
        console_error_panic_hook::set_once();

    Ok(())
}

#[wasm_bindgen]
#[repr(u8)]
pub enum Cell {
    Empty = 0,
    Fill = 1,
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
        let width: u32 = 64;
        let height: u32 = 64;

        let generate_random = |min, max| -> usize {
            Math::floor(Math::random() * (max - min + 1) as f64 + min as f64) as usize
        };

        let random = generate_random(0, width * height);
        let cells = (0..width * height)
            .map(|i| {
                if random as u32 == i {
                    Cell::Fill
                } else {
                    Cell::Empty
                }
            })
            .collect();

        Grid {
            width,
            height,
            cells,
        }
    }
}