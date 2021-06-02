const rust = import('../pkg/index');

(async function () {
    let app = await rust;
    document.body.innerHTML = "<p>" + app.calculate(2, 3) + "</p>"
})()
