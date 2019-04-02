import React from 'react';
import * as UPLOAD_ACTIONS from '../actions/file_upload';
import {connect} from 'react-redux';
import {VALID_UPLOAD} from '../consts';
import DropTarget from './drag_drop_target';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class AdminUpload extends React.Component
{
    constructor()
    {
        super();
        this.selectFile = this.selectFile.bind(this);
        this.do_upload = this.do_upload.bind(this);
        this.file_selector=React.createRef();
        this.select_files=this.select_files.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.setSelected = this.setSelected.bind(this);
    }

    componentDidMount()
    {
        this.props.init_upload_page(this.props.filetype);
    }


    do_upload()
    {
        this.props.do_upload(this.props.upload.upload_ar, this.props.upload.selected_directory, this.props.filetype);
    }

    selectFile(e)
    {
        let files = e.target.files || e.dataTransfer.files;
        if(!files.length)
            return;
        this.files = files;
        for(let i=0; i<files.length; i++)
        {        
            this.createUploadableFile(files[i]);
        }
    }

    createUploadableFile(file){
        let reader = new FileReader();
        reader.onload = (e)=>{
            this.props.add_uploadable({fname: file.name, file_data: e.target.result, size:file.size, filetype:this.props.filetype});
        }
        reader.readAsDataURL(file);
    }

    select_files()
    {
        this.file_selector.current.click();
    }

    onDrop(dropped){
         Array.isArray(dropped)?dropped.map((item)=>this.createUploadableFile(item)):this.createUploadableFile(dropped);
      }

    setSelected(e)
    {
        this.props.select_directory(e.target.value);
    }

    render()
    {
        const hidden={display:'none'};
        return (            
        <React.Fragment>
            <div className="row">
                <div className="small-2 columns">
                    <div>state - {this.props.upload.upload_state}</div>
                    {this.props.filetype==='image'?
                    <select value={this.props.upload.selected_directory} onChange={this.setSelected}>{this.props.upload.directories.map((item)=><option key={item} value={item}>{item}</option>)}</select>
                    :null}
                    <button className='button' onClick={this.do_upload} disabled={this.props.upload.upload_state===UPLOAD_ACTIONS.UPLOAD_COMPLETE}>Upload</button>
                    <button className='button' onClick={this.select_files}>select</button>
                    <DropTarget onDrop = {this.onDrop} />
                    <div style={hidden}><input ref={this.file_selector} type='file' id='single' onChange={this.selectFile} multiple /></div>
                    <div className='drag_drop_panel'></div>
                </div>
                <div className="small-10 columns">
                    <div className='row gallery-container small-up-2 medium-up-4 large-up-4'>
                        {this.props.upload.upload_ar.map((item, index)=>{
							console.log(index, item.complete);
                            const comp = 'Complete:-'+item.complete+'%';
                            return(
                        <div key={index+item.fname} className='column column-block gallery'>
                            {
                                (this.props.filetype==='image' & item.enabled === VALID_UPLOAD.Uploadable) ? 
                                    <img  src={item.file_data} />:<div className='bad_upload_name'>
                                    {item.fname}</div>
                            }
                        <p>{(item.complete !== UPLOAD_ACTIONS.UPLOAD_NONE) ? comp :null}</p>
                        <p>{item.enabled ?  Object.keys(VALID_UPLOAD)[item.enabled] : item.complete === 100?null:'READY'}</p>
                        <p><button id={'remove_'+index} className='button' onClick={this.props.remove_uploadable.bind(this, index)} disabled={this.props.upload.upload_state !== UPLOAD_ACTIONS.UPLOAD_NONE}>Delete</button></p>
        </div>)})}
                </div>
            </div>
        </div>
    </React.Fragment>
    )
    }   
} 

const mapStateToProps = state => {
        return {
            upload: state.file_upload
        };
      };
      
    
const mapDispatchToProps = dispatch=>{
        return {
            do_upload: (ar, dir, filetype)=>dispatch(UPLOAD_ACTIONS.do_upload(ar, dir, filetype)),
            add_uploadable: (img)=>dispatch(UPLOAD_ACTIONS.add_to_upload(img)),
            remove_uploadable: (index)=>dispatch(UPLOAD_ACTIONS.remove_uploadable(index)),
            init_upload_page: (filetype)=>dispatch(UPLOAD_ACTIONS.InitUploadPage(filetype)),
            select_directory: (val)=>dispatch(UPLOAD_ACTIONS.SelectDirectory(val))
        }
      }
      
export default connect(mapStateToProps, mapDispatchToProps)( DragDropContext(HTML5Backend)(AdminUpload));
      

