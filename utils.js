async function handleError(err_title,err_string) {
    let err_box = document.getElementsByClassName('err_container')[0]
    let err_string_el = document.getElementById('error')
    let err_title_el = document.getElementById('err_title')
    // document.getElementById('main').style.display = 'none'
    document.getElementById('main').style.filter = 'blur(5px)'
    err_box.style.display = 'flex'
    err_string_el.textContent = err_string
    err_title_el.textContent = err_title
    
    is_button_active  = false

    err_box.querySelector('button').addEventListener('click', async () => {
        await closeError()
    });
}

async function closeError() {
    let err_box = document.getElementsByClassName('err_container')[0]
    // document.getElementById('main').style.display = 'block'
    document.getElementById('main').style.filter = ''
    err_box.style.display = 'none'
    is_button_active  = true
}
