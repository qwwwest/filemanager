import HomeIcon from '@material-ui/icons/Home';


function BreadCrump(props) {

    const path = props.path.split('/');
    let str = '';

    return <div>
        {path.map((part, index) => {
            str += '/' + part;

            return <span key={index + part}>  {(index === 0) ? null : ' / '}
                <a href="#0" onClick={props.action}
                    title={'cd ' + str}
                    data-cmd="cd"
                    data-params={str}> {(index === 0) ? <HomeIcon /> : part}</a ></span>


        })
        }
    </div>

}

export default BreadCrump;