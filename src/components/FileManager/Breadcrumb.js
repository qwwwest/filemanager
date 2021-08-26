import HomeIcon from '@material-ui/icons/Home';


function BreadCrump(props) {

    const paths = props.path;
    const path = props.path.split('/');
    let str = '';
    const plop = (e) => { alert('YES') };
    return <div>
        {path.map((part, index) => {
            str += '/' + part;
            if (index === 0) return <span key={index + part}>
                <a href="#" onClick={props.action}
                    title={'cd ' + str}
                    data-cmd="cd"
                    data-params={'/'}

                > <HomeIcon /> home</a>
            </span>
            return <span key={index + part}> /
                <a href="#" onClick={props.action}
                    title={'cd ' + str}
                    data-cmd="cd"
                    data-params={str}> {part}</a></span>


        })
        }
    </div>

}

export default BreadCrump;