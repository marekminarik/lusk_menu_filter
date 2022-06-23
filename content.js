
//if (window.location.host.startsWith("data7.comgate"))
//	Array.from(document.querySelectorAll("div")).forEach(x=>x.style.backgroundColor="#ffa5a5");
	
const lusk_menu_ext_disabled = flase
	
if (
	lusk_menu_ext_disabled || (
	!(window.location.host.startsWith('data7.comgate')) &&
	!(window.location.host.startsWith('localhost:8081')) &&
	!(window.location.host.startsWith('lusk-test')))
) {
    throw new Error('filtrování LUSK menu funguje pouze na stránkách LUSKu')
}


let menu_filter_input_elem = document.createElement("input"),
    filter_wrapper = document.createElement('div'),
    result_wrapper = document.createElement('div')

let ignore_when_tag_focused = [
    'INPUT',
    'TEXTAREA',
    'OPTION',
    'SELECT',
]

function getLeaves (root, click_chain = []) {
    if (root.childElementCount > 0) {
        let tmp = []
        Array.from(root.children).forEach(n => {
            tmp.push(...getLeaves(n, [...click_chain, ...(root.classList.contains('dropdown') ? [root] : [])]))
        })
        return tmp
    }
    return root.innerText ? [{'click_chain': click_chain, 'node': root}] : []
}

function check_match(str, target) {
    target = normalize(target)
    str = normalize(str)
    let pattern = str.split('').map((x)=>x+'.*').join('')
    let regex = new RegExp(pattern, "g")
    return target.match(regex)
}


function normalize(str) {
    let replace_obj = {
        'á': 'a',
        'č': 'c',
        'ď': 'd',
        'é': 'e',
        'ě': 'e',
        'í': 'i',
        'ň': 'n',
        'ó': 'o',
        'ř': 'r',
        'š': 's',
        'ť': 't',
        'ú': 'u',
        'ů': 'u',
        'ý': 'y',
        'ž': 'z',
    }

    return str.toLowerCase().split('').map(x=>(replace_obj[x] ?? x)).join('')
}


function init_menu_filter() {

    let nodes = getLeaves(document.querySelector('.nav,.navbar-nav,.navbar-middle,.pull-left,.nav'))

    filter_wrapper.appendChild(result_wrapper)
    filter_wrapper.appendChild(menu_filter_input_elem)
    

    menu_filter_input_elem.type = 'text'
    menu_filter_input_elem.placeholder = 'vyhledávání v menu'

    filter_wrapper.style = 'z-index: 1000000; position: fixed; bottom: 0; left: 0; max-width: 20vw;'

    document.body.appendChild(filter_wrapper)


    menu_filter_input_elem.addEventListener('focusout', _ => {
        setTimeout( _ => {
                nodes.forEach(n => {
                    n['node'].style.backgroundColor = ''
                    result_wrapper.innerHTML = ''
                })
            },
            750
        )
    })

    window.addEventListener('keydown', e => {

        if (document.activeElement != menu_filter_input_elem && 
            (
                ignore_when_tag_focused.includes(document.activeElement.tagName)
                || e.key != 'Backspace'
            )
        ) {
            return
        }

        nodes.forEach(n => {
            result_wrapper.innerHTML = ''
            n['node'].style.backgroundColor = ''
            n['click_chain'].forEach(e=>{e.classList.remove('open')})
        })
        
        menu_filter_input_elem.focus()
        
        let inp_text = menu_filter_input_elem.value + (e.key.length > 1 ? '' : e.key)
        console.log(inp_text)

        if (inp_text < 3) {
            return
        }

        nodes.forEach(n => {
            n['click_chain'].forEach(e=>{e.classList.remove('open')})
        })

        let tmp = nodes.filter(x => check_match(inp_text, x['node'].innerText))
             
        tmp.forEach(n => {
            n['node'].style.backgroundColor = '#F2D2BD'
            n['click_chain'].forEach(e=>e.classList.add('open'))
        })

        if (tmp.length < 7) {
            tmp.forEach(n => {
                let cloned = n['node'].cloneNode(true)
                cloned.style = 'display: block; background-color: white; border: 1px solid #aaa;'
                result_wrapper.appendChild(cloned)
            })
        }
        
    })

}

init_menu_filter()


