
export default function DropZone(props) {

    //const [files, setFiles] = useState([]);
    const dragDropUpload = (window.File && window.FileReader && window.FileList && window.Blob);


    const noRedirection = (e) => {
        e.stopPropagation();// Stops some browsers from redirecting.
        e.preventDefault();
    };

    const handleDrop = (e) => {
        noRedirection(e);

        let files = [...props.files];
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            const file = e.dataTransfer.files[i];
            if (files.findIndex(f => (f.name === file.name)) === -1) files.push(file);

        }


        props.setFiles(files);
    }

    const line = (file, index) => {
        console.log(file);
        return <li key={file + index}>{file.name} <button title={'remove ' + file.name}
            onClick={(e) => remove(index)}>x</button></li>

    }

    const remove = (index) => {
        let a = [...props.files];
        a.splice(index, 1);
        props.setFiles(a);


    }

    //drag and drop
    return (dragDropUpload) ?
        <div id="dropzone" onDrop={handleDrop}
            onDragOver={noRedirection} onDragEnter={noRedirection}>
            <h1 > {props.title}</h1 >
            <ul>{props.files.map(line)}</ul>
            {
                props.files.length ? <div><button onClick={e => props.setFiles([])}>clear</button>
                    <button onClick={e => props.upload(e)}>upload</button></div> : null
            }
        </div>
        :

        <form method='post' onSubmit={props.upload} encType='multipart/form-data'>
            <input type="file" name="file[]"
                id="files" multiple onChange={(e) => props.setFiles([...e.target.files])} />
            <input type='submit' name='submit' value='Upload' />
            {props.files ? props.files.map(file => <div key={file.name}>{file.name}</div>) : null}
        </form>




}