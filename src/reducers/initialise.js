import {UPLOAD_NONE} from '../actions/file_upload';

export function init_popup(){return{popup_stack:[], image_root:'', image_list:[], image_list_index:-1, max_images:12}};
export function init_file_upload(){return{upload_state:UPLOAD_NONE, upload_ar:[], directories:[], selected_directory:''}}
