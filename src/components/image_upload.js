import React from 'react';
import * as UPLOAD_ACTIONS from '../actions/file_upload';
import {connect} from 'react-redux';

class ImageUpload extends React.Component
{
    constructor()
    {
        super();
        this.selectImage = this.selectImage.bind(this);
        this.do_upload = this.do_upload.bind(this);
        this.images = [];
        this.file_selector=React.createRef();
        this.select_files=this.select_files.bind(this);
    }

    componentDidMount()
    {
    }

    do_upload()
    {
     this.props.do_upload(this.props.upload.upload_ar);
    }

    selectImage(e)
    {
        this.images.length = 0;
        let files = e.target.files || e.dataTransfer.files;
        if(!files.length)
            return;
        this.files = files;
        for(let i=0; i<files.length; i++)
        {        
            this.createImage(files[i]);
        }
    }

    createImage(image){
        console.log(image.name);
        let reader = new FileReader();
        reader.onload = (e)=>{
            this.props.add_uploadable({fname: image.name, file_data: e.target.result});
        }
        reader.readAsDataURL(image);
    }

    select_files()
    {
        this.file_selector.current.click();
    }

    render()
    {
        console.log('len ' + this.images.length);
        const hidden={display:'none'};
        return (            
        <React.Fragment>
            <h1>NOT USED NOT USED NOT USED</h1>
            <div className='buttons fadein'>
                <div className='button'>
                    <label htmlFor='single'></label>
                    <div style={hidden}>
                    <input ref={this.file_selector} type='file' id='single' onChange={this.selectImage} multiple /> 
                    </div>
                    <div>{this.props.upload.upload_ar.map((item, index)=><img src={item.image} alt={'uploadable_image_'+index}/>)}</div>
                    <div>state - {this.props.upload.upload_state}</div>
                    <p></p>
                    <button onClick={this.do_upload}>Upload</button>
                    <button onClick={this.select_files}>select</button>
                </div>
            </div>
        </React.Fragment>
    )
    }   
} 

const mapStateToProps = state => {
        return {
            upload: state.image_upload
        };
      };
      
    
const mapDispatchToProps = dispatch=>{
        return {
            do_upload: (ar)=>dispatch(UPLOAD_ACTIONS.do_upload(ar)),
            add_uploadable: (img)=>dispatch(UPLOAD_ACTIONS.add_to_upload(img))
        }
      }
      
export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload);
      