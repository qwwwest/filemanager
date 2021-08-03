

function ImagePreview(props) {

    const filename = props.image.filename //.replace(/^.*[\\\/]/, '')

    return <div className="imagePreview">
        <img src={props.image.url} alt={props.image.name} />
        <div>{props.image.name}<br />({props.image.imagesize})</div>
    </div>

}

export default ImagePreview;