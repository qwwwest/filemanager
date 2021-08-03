
import { API } from '../App';

const postData = async (url = '', data = {}) => {

    let formData = new FormData();

    formData.append('cmd', data['cmd']);
    formData.append('path', data['path']);

    for (let key in data.params) {
        formData.append('params[]', data.params[key]);

    }
    if (this.state.files) {

        //Loop through array of file and append form Data
        for (let i = 0; i < this.state.files.length; i++) {
            const file = this.state.files[i];
            formData.append("file[]", file);
        }


    }
    //Fetch Request

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit

        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formData
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export const fetchData = (cmd, path, params) => {



    //'params[]': params
    postData(API, { cmd, path, params })
        .then(
            (data) => {

                const files = (cmd === 'upload') ? [] : [... this.state.files];
                this.setState({
                    isLoaded: true,
                    ls: data.ls,
                    path: data.path,
                    message: data.message,
                    error: data.error,
                    selection: [],
                    copied: [... this.state.copied],
                    files
                });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                console.log('WOOOOOPS', error);
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
}
