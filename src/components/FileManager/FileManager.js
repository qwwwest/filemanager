import React, { useState } from "react";
import BreadCrump from './Breadcrumb';
import ImagePreview from './ImagePreview';
import DropZone from './DropZone';
import './FileManager.css';
import { API } from '../../App';
import Folder from '@material-ui/icons/Folder';


class FileManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            ls: [],
            path: '/',
            copied: [],
            selection: [],
            files: []
        };


    }
    x
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



        //'params[]': params
        this.postData(API, { cmd, path, params })
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


    componentDidMount() {
        this.fetchData('ls', this.state.path, []);
    }
    line = (item, index) => {
        return <tr key={index + item.name} id={item.name}>
            <td><input type="checkbox" name="" id={index} onChange={this.toggle} /></td>
            <td className={item.name.match(/.(jpg|jpeg|png|gif)$/i) ? 'hasImg' : null}>{item.isDir ? <Folder /> :
                item.name.match(/.(jpg|jpeg|png|gif)$/i) ?
                    <div>
                        <img className='thumb' src={item.url} alt={item.name} />
                        <span><ImagePreview image={item} /></span>
                    </div> : null} </td>
            <td>{item.isDir ? <a href="#"
                onClick={this.action}
                title={"cd " + item.name}
                data-cmd="cd"
                data-params={item.name}>
                {item.name}</a> : item.name} </td>
            <td>{item.date}</td>
            <td>{item.filesize}</td>
            <td>
                <span className="actions">
                    <a href="#" onClick={this.rm}
                        title={"rm " + item.name}
                        data-params={item.name}>delete</a> &nbsp;
                    <a href="#" onClick={this.mv} data-params={item.name}>rename</a> &nbsp;
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
                let selection = [... this.state.selection];
                selection.splice(index, 1);
                this.setState({ "selection": selection });
            }
        }
    }

    upload = (e) => {
        e.preventDefault();
        this.fetchData('upload', this.state.path, []);
    }
    cd = (e) => {
        e.preventDefault();

        this.fetchData('cd', this.state.path, [e.target.parentElement.parentElement.id]);
    }

    copy = (e) => {
        e.preventDefault();
        this.setState({ selection: [], copied: [... this.state.selection] });
    }


    action = (e) => {
        e.preventDefault();
        const cmd = e.target.dataset.cmd;
        const params = (e.target.dataset.params || '').split(' ');
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

    mv = (e) => {
        e.preventDefault();
        let newName = prompt("New name:", e.target.dataset.params);
        const params = e.target.dataset.params;
        if (newName) {
            this.fetchData('mv', this.state.path, [params, newName]);
        }


    }

    cancel_multi = (e) => {
        e.preventDefault();
        this.setState({ copied: [] });


    }



    setFiles = (files) => {
        this.setState({ files: [...files] });
    }


    render() {
        const { error, isLoaded, ls, message, files } = this.state;


        console.log(ls);
        if (error) setTimeout(() => { alert(error) }, 500)
        if (this.state.message) setTimeout(() => { this.setState({ message: '' }) }, 3000);

        if (!isLoaded) {
            return <div>Loading...</div>;
        } else {

            return (
                <div>
                    <div className="message">{this.state.message}</div>
                    <h1><BreadCrump path={this.state.path} action={this.action} /></h1>





                    <table>
                        <thead><tr>
                            <td> <input type="checkbox" name="" id={0} onChange={this.toggle} /> </td><td>  </td><td >Name</td><td>Date</td><td>Size</td><td>Actions</td></tr></thead>

                        <tbody>
                            {//onClick={this.cd} data-cmd="cd" data-params={item.name}
                                this.state.path !== '/' ? <tr id='..'>
                                    <td></td>
                                    <td> <a href="#" onClick={this.action}
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
                            <td colSpan="4">

                                <a href="#" onClick={this.mkdir}>Create Folder</a>

                                {this.state.copied.length ? <React.Fragment>
                                    <a href="#" onClick={this.cancel_multi}>cancel</a>

                                    <a href="#" onClick={this.cd}>move</a>
                                    <a href="#" onClick={this.cd}>paste</a>

                                </React.Fragment>
                                    : (
                                        this.state.selection.length ?
                                            <>  <a href="#" onClick={this.copy}>copy</a>
                                                <a href="#" onClick={this.rm}>delete</a>
                                            </> : ''
                                    )}
                            </td></tr>
                        </tfoot>

                    </table>
                    <span className="actions">
                        {this.state.copied.length ? <div>copied:{this.state.copied} </div> : null}
                        {this.state.selection.length ? <div>selection:{this.state.selection} </div> : null}
                    </span>
                    <DropZone title="Drop Zone" files={this.state.files}
                        setFiles={this.setFiles} upload={this.upload} />
                </div >

            );
        }
    }
}

export default FileManager;

// ReactDOM.render(<App />, document.getElementById('root'));