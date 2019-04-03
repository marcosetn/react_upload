import {VALID_UPLOAD} from '../consts';

export const ADD_UPLOADABLE="ADD_UPLOADABLE";
export const REMOVE_UPLOADABLE="REMOVE_UPLOADABLE";
export const DO_UPLOAD="DO_UPLOAD";
export const SET_UPLOAD_STATE="SET_UPLOAD_STATE";
export const INIT_UPLOAD_PAGE="INIT_UPLOAD_PAGE";
export const SELECT_DIRECTORY="SELECT_DIRECTORY";

export const UPLOAD_IN_PROGRESS="UPLOAD IN PROGRESS";
export const UPLOAD_NONE="READY";
export const UPLOAD_COMPLETE="UPLOAD COMPLETE";
export const UPLOAD_FAILED="FAILED";
export const FILE_PROGRESS="FILE_PROGRESS";

const _URL = "http://localhost/bttc/public/";
const ADMIN_URL = _URL + 'admin/';

//const VALID_UPLOAD=Object.freeze({"Uploadable":0, "Cancelled":1, "Too Big":2, "Wrong Filetype":3});

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
  };



const upload_list = (list, index, dir, filetype, dispatch)=>{
    return new Promise((resolve, reject)=>{        
        function upload_file(list, index, dir, filetype, dispatch)
        {
            return new Promise((resolve)=>
            {
                const item = list[index];
                if(item.enabled !== VALID_UPLOAD.Uploadable)
                    return resolve(++index);
                let f = new FormData();        
                f.append('items[]', JSON.stringify({fname:item.fname, file_data:item.file_data}));
                f.append('dir', dir);
				f.append('filetype', filetype);


				let inner_index = 0;
				const tim = window.setInterval(()=>{
					if(inner_index <= 10)
					{
						if(inner_index === 10)
						{
							dispatch({type:FILE_PROGRESS, complete:100, fname:item.fname});
							index++;
							clearInterval(tim);
							return resolve(index);
						}
						else
						{
							inner_index++;						
							dispatch({type:FILE_PROGRESS, complete:inner_index*10, fname:item.fname});
						}
					}
				}, 50);


				/*
                const xhr = new XMLHttpRequest();

                xhr.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        let percentComplete = e.loaded / e.total * 100;
                        dispatch({type:FILE_PROGRESS, complete:e.loaded/e.total, fname:item.fname});
                    }
                });

                xhr.addEventListener('load', (e)=>{
                    const obj = JSON.parse(e.currentTarget.response);
                    if(!obj.hasOwnProperty('error'))
                        dispatch({type:FILE_PROGRESS, complete:100, fname:item.fname});
                    else
                        dispatch({type:FILE_PROGRESS, complete:obj.error, fname:item.fname});
                    index++;
                    return resolve(index);
                });
                xhr.addEventListener('error', e=>{
                    console.dir(e);
                });
                xhr.open("POST", _URL+'do_upload');
				xhr.send(f);
				*/
            });
        }
        function recursive_loop(list, index, dir, filetype, dispatch)
        {
            upload_file(list, index, dir, filetype, dispatch)
            .then(val=>{index=val;
                if(index<list.length)
                    recursive_loop(list, index, dir, filetype, dispatch)
                else
                    resolve('all done');
            });
        }
        return recursive_loop(list, index, dir, filetype, dispatch);
    });
}




const real_upload_list = (list, index, dir, filetype, dispatch)=>{
    return new Promise((resolve, reject)=>{        
        function upload_file(list, index, dir, filetype, dispatch)
        {
            return new Promise((resolve)=>
            {
                const item = list[index];
                if(item.enabled !== VALID_UPLOAD.Uploadable)
                    return resolve(++index);
                let f = new FormData();        
                f.append('items[]', JSON.stringify({fname:item.fname, file_data:item.file_data}));
                f.append('dir', dir);
                f.append('filetype', filetype);
                const xhr = new XMLHttpRequest();

                xhr.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        let percentComplete = e.loaded / e.total * 100;
                        dispatch({type:FILE_PROGRESS, complete:e.loaded/e.total, fname:item.fname});
                    }
                });

                xhr.addEventListener('load', (e)=>{
                    const obj = JSON.parse(e.currentTarget.response);
                    if(!obj.hasOwnProperty('error'))
                        dispatch({type:FILE_PROGRESS, complete:100, fname:item.fname});
                    else
                        dispatch({type:FILE_PROGRESS, complete:obj.error, fname:item.fname});
                    index++;
                    return resolve(index);
                });
                xhr.addEventListener('error', e=>{
                    console.dir(e);
                });
                xhr.open("POST", _URL+'do_upload');
                xhr.send(f);
            });
        }
        function recursive_loop(list, index, dir, filetype, dispatch)
        {
            upload_file(list, index, dir, filetype, dispatch)
            .then(val=>{index=val;
                if(index<list.length)
                    recursive_loop(list, index, dir, filetype, dispatch)
                else
                    resolve('all done');
            });
        }
        return recursive_loop(list, index, dir, filetype, dispatch);
    });
}


export const do_upload=(flist, dir, filetype)=>{
    return dispatch=>{
        dispatch(set_upload_state(UPLOAD_IN_PROGRESS));
        upload_list(flist, 0, dir, filetype, dispatch)
        .then(()=>dispatch(set_upload_state(UPLOAD_COMPLETE)));        
    }
}

export const set_upload_state=(upload_state)=>{
    return{
        type: SET_UPLOAD_STATE,
        upload_state: upload_state
    }
}

export const add_to_upload=(item)=>
{
    return{
        type: ADD_UPLOADABLE,
        payload: item
    }
}

export const remove_uploadable=index=>{
    return{
        type:REMOVE_UPLOADABLE,
        index:index
    }
}

/*emulate response from server - returns directory names where images are stored */
export function InitUploadPage(filetype)
{
	return {
		type: INIT_UPLOAD_PAGE,
		directories : ['slideshow', 'recipes', 'ingredients']
   }

	/*
    return dispatch=>{
        return fetch(ADMIN_URL+'image_directories/'+filetype, {method:'GET'})
        .then(res=>res.json())
        .then(res=>{
            dispatch({
                type: INIT_UPLOAD_PAGE,
                directories : res.directories
           });
        });
	}
	*/
}

export const SelectDirectory = selected=>
{
    return {
        type: SELECT_DIRECTORY,
        selected:selected
    }
}