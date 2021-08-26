import React, { useState } from "react";
import BreadCrump from './Breadcrumb';
import ImagePreview from './ImagePreview';
import DropZone from './DropZone';
import SignIn from '../ui/SignIn';
import './FileManager.css';
import { API } from '../../App';
import Folder from '@material-ui/icons/Folder';
import { ThemeProvider } from '@material-ui/core'
import { createTheme } from '@material-ui/core/styles'


class FileManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            isConnected: false,
            ls: [],
            path: '/',
            from: '',
            copied: [],
            selection: [],
            files: []
        };


    }

    postData = async (url = '', data = {}) => {

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

    fetchData = (cmd, path, params) => {

        this.postData(API, { cmd, path, params })
            .then(
                (data) => {
                    console.log(data);
                    const files = (cmd === 'upload') ? [] : [...this.state.files];
                    this.setState({
                        isLoaded: true,
                        isConnected: data.isLogged,
                        ls: data.ls,
                        path: data.path,
                        message: data.message,
                        error: data.error,
                        from: this.state.from,
                        selection: [],
                        copied: [...this.state.copied],
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


    componentDidMount() {
        this.fetchData('ls', this.state.path, []);
    }
    li = (item) => <li>{item}</li>;
    line = (item, index) => {

        const checked = this.state.selection.indexOf(item.name) !== -1
            || this.state.copied.indexOf(item.name) !== -1;
        return <tr key={index + item.name} id={item.name}>
            <td>{this.state.copied.length === 0 || this.state.path === this.state.from ? <input type="checkbox" name="" id={index} onChange={this.toggle}
                checked={checked} /> : null} </td>
            <td className={item.name.match(/.(jpg|jpeg|png|gif)$/i) ? 'hasImg' : null}>{item.isDir ? <Folder /> :
                item.name.match(/.(jpg|jpeg|png|gif)$/i) ?
                    <div>
                        <img className='thumb' src={item.url} alt={item.name} />
                        <span><ImagePreview image={item} /></span>
                    </div> : null} </td>
            <td>{item.isDir ? <a href="#0"
                onClick={this.action}
                title={"cd " + item.name}
                data-cmd="cd"
                data-params={item.name}>
                {item.name}</a> : item.name} </td>
            <td>{item.date}</td>
            <td>{item.filesize}</td>
            <td>
                <span className="actions">
                    <a href="#0" onClick={this.rm}
                        title={"rm " + item.name}
                        data-params={item.name}>delete</a> &nbsp;
                    <a href="#0" onClick={this.rename} data-params={item.name}>rename</a> &nbsp;
                </span>
            </td></tr >
    }

    toggle = (e) => {
        //e.preventDefault();
        const cb = e.target;
        console.log(cb);
        console.log(cb.parentElement.parentElement.id);
        if (cb.checked) {
            this.setState({ selection: [...this.state.selection, cb.parentElement.parentElement.id] });
            //this.state.selection.push();
        } else {
            const index = this.state.selection.indexOf(cb.parentElement.parentElement.id);
            if (index > -1) {
                let selection = [...this.state.selection];
                selection.splice(index, 1);
                this.setState({ "selection": selection });
            }
        }
    }
    selectAll = (e) => {
        e.preventDefault();

        if (this.state.selection.length) {
            this.setState({ selection: [] });
            return;
        }
        const folders = this.state.ls.folders.map(f => f.name);
        const files = this.state.ls.files.map(f => f.name);
        this.setState({ selection: [...folders, ...files] });

    }
    upload = (e) => {
        e.preventDefault();
        this.fetchData('upload', this.state.path, []);
    }
    logout = (e) => {
        e.preventDefault();
        this.fetchData('logout', this.state.path, []);
    }
    cd = (e) => {
        e.preventDefault();

        this.fetchData('cd', this.state.path, [e.target.parentElement.parentElement.id]);
    }

    copy = (e) => {
        e.preventDefault();
        this.setState({
            selection: [],
            from: this.state.path,
            copied: [...this.state.selection]
        });
    }


    action = (e) => {
        e.preventDefault();
        const cmd = e.currentTarget.dataset.cmd;
        const params = (e.currentTarget.dataset.params || '').split(' ');

        this.fetchData(cmd, this.state.path, params);
    }
    rm = (e) => {
        e.preventDefault();
        let params = [];
        if (e.target.dataset.params) {
            params = (e.target.dataset.params || '').split(' ');
            if (window.event.ctrlKey || window.confirm("DELETE :" + params[0])) {
                this.fetchData('rm', this.state.path, params);
            }
        }
        else if (this.state.selection.length) {
            params = this.state.selection;
            this.fetchData('rm', this.state.path, params);
        }


    }
    mkdir = (e) => {
        e.preventDefault();
        let folder = prompt("New Folder:");

        if (folder !== null && folder.length > 0) {
            this.fetchData('mkdir', this.state.path, [folder]);
        }

    }

    rename = (e) => {
        e.preventDefault();
        let newName = prompt("New name:", e.target.dataset.params);
        const params = e.target.dataset.params;
        if (newName) {
            this.fetchData('rename', this.state.path, [params, newName]);
        }


    }

    moveMultiple = (e) => {
        e.preventDefault();
        if (this.state.path === this.state.from) return;
        let files = this.state.copied.map(file => this.state.from + '/' + file);
        this.fetchData('moveMultiple', this.state.path, files);
        this.setState({ copied: [] });
    }

    copyMultiple = (e) => {
        e.preventDefault();
        if (this.state.path === this.state.from) return;


        let files = this.state.copied.map(file => this.state.from + '/' + file);
        this.fetchData('copyMultiple', this.state.path, files);
        this.setState({ copied: [] });
    }

    cancel_multi = (e) => {
        e.preventDefault();
        this.setState({ copied: [] });


    }


    setFiles = (files) => {
        this.setState({ files: [...files] });
    }

    login = (login, password) => {

        this.fetchData('login', this.state.path, [login, password]);
    }


    render() {
        const { error, isLoaded, ls, isConnected } = this.state;


        if (error) setTimeout(() => { alert(error) }, 500)

        if (!isLoaded) {
            return <div>Loading...</div>;
        }
        if (this.state.message) setTimeout(() => { this.setState({ message: '' }) }, 3000);

        if (!isConnected) {
            const darkTheme = createTheme({
                palette: {
                    type: 'dark',
                },
            });
            return <ThemeProvider theme={darkTheme}>
                <SignIn onSubmit={this.login} message={this.state.message || "(login: user , password: user)"} />
            </ThemeProvider>


        }

        let isDestinationFolderValid = this.state.copied.length && this.state.path !== this.state.from;

        if (isDestinationFolderValid) {
            let i = 0;
            for (; i < this.state.copied.length; i++) {
                const file = this.state.from + this.state.copied[i];
                console.log(file, this.state.path);
                if (this.state.path.startsWith(file)) break;
            }
            isDestinationFolderValid = (i === this.state.copied.length);

        }
        return (
            <div>
                <div className="message">{this.state.message}</div>
                <button className="logout" onClick={this.logout}>Logout</button>
                <h1><BreadCrump path={this.state.path} action={this.action} /></h1>





                <table>
                    <thead><tr>
                        <td> </td><td>  </td><td >Name</td><td>Date</td><td>Size</td><td>Actions</td></tr></thead>

                    <tbody>
                        {//onClick={this.cd} data-cmd="cd" data-params={item.name}
                            this.state.path !== '/' ? <tr id='..'>
                                <td></td>
                                <td> <a href="#0" onClick={this.action}
                                    data-cmd="cd"
                                    data-params={'..'}
                                    title={"cd .."}>..</a>  </td>
                                <td></td>
                                <td></td>
                                <td>
                                </td></tr>
                                : null
                        }
                        {ls.folders ? ls.folders.map(this.line) : null}{ls.files ? ls.files.map(this.line) : null}</tbody>

                    <tfoot><tr className="actions">
                        <td colSpan="6">

                            <a href="#0" onClick={this.mkdir}>Create Folder</a>
                            <a href="#0" onClick={this.selectAll}>Select ALL</a>

                            {this.state.copied.length ? <React.Fragment>


                                {this.state.from !== '' ? <React.Fragment>



                                    <a href="#0" onClick={this.rm}>delete</a>
                                </React.Fragment> : ''}

                            </React.Fragment>
                                : (
                                    this.state.selection.length ?
                                        <>  <a href="#0" onClick={this.copy}>copy selected files in Clipboard</a>
                                            <a href="#0" onClick={this.rm}>delete selected files</a>
                                        </> : ''
                                )}
                        </td></tr>
                    </tfoot>

                </table>

                <span className="actions">
                    {this.state.copied.length ? <div> files in the Clipboard from "{this.state.from}":
                        <ul>{this.state.copied.map(this.li)}</ul>
                        <a href="#0" onClick={this.cancel_multi}>clear</a>
                        {isDestinationFolderValid ?
                            <><a href="#0" onClick={this.moveMultiple}>move {this.state.copied.length} file{this.state.copied.length === 1 ? '' : 's'} in {this.state.path}  </a>
                                <a href="#0" onClick={this.copyMultiple}>copy {this.state.copied.length} file{this.state.copied.length === 1 ? '' : 's'} in {this.state.path}  </a>
                            </> : null
                        }

                    </div> : <DropZone title="Drop Zone" files={this.state.files}
                        setFiles={this.setFiles} upload={this.upload} />}

                </span>

            </div >

        );

    }
}

export default FileManager;

// ReactDOM.render(<App />, document.getElementById('root'));