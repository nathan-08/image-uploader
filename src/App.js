import React, { Component } from 'react';
import './App.css';
import ProgressBar from './components/progressBar/ProgressBar'
// import axios from 'axios';

class App extends Component {
  state = {
    dataString: null,
    showProgress: true
  }
  onclick(){
    var req = new XMLHttpRequest();
    req.addEventListener("load", function(e){
      console.log('result: ', e.currentTarget.response)
    })
    req.open("GET", "/check");
    req.send();
  }
  handleInput = (evt) => {
    const file = evt.target.files[0];
    const reader = new FileReader();
    const trueThis = this
    console.log('handle input')
    reader.addEventListener("load", function() {
      console.log('loaded_____')

      trueThis.setState({
        dataString: reader.result
      })
    }, false)
    reader.addEventListener("progress", function(e){
      console.log(`
        __local_upload_progress__
      `, e)
    })

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  sendImgToServer=()=>{
    let post = new XMLHttpRequest();
    post.addEventListener("loadstart",  function(){
      document.querySelector('.progress-bar-component').classList.remove('hidden')
    })
    post.upload.addEventListener("progress", function(e){
      console.log(`
        __upload_progress__
        loaded: ${e.loaded}
        totalLength: ${e.total}
        percentage: ${parseFloat((e.loaded/e.total)*100).toFixed(2)}
      `)
      let pbar = document.querySelector('.progress-bar-fill')
      let container = document.querySelector('.progress-bar-component')
      let totalWidth = container.offsetWidth
      let ratioComplete = (e.loaded/e.total)
      pbar.style.width = totalWidth * ratioComplete + "px"
    })
    post.addEventListener("load", function(e){
      console.log('__request_complete__')
      // hide progress bar
      let container = document.querySelector('.progress-bar-component')
      setTimeout(_=>{
        container.classList.add('hidden')
      },1500)
      setTimeout(_=>{
        container.children[0].style.width = 0
      },2000)
    })
    post.addEventListener("error", function(e){
      console.log('__request_error__', e)
    })
    post.open("POST", "/upload-img"); 
    post.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    post.send(JSON.stringify({dataURL: this.state.dataString}))
  }
  getImageFromServer=()=>{
    let getRequest = new XMLHttpRequest();
    let trueThis = this
    getRequest.addEventListener("loadstart",  function(){
      document.querySelector('.progress-bar-component').classList.remove('hidden')
    })
    getRequest.addEventListener("load", function(e){
      console.log('__request_complete__')
      // hide progress bar
      let container = document.querySelector('.progress-bar-component')
      
      
      setTimeout(_=>{
        container.classList.add('hidden')
      },1500)
      setTimeout(_=>{
        container.children[0].style.width = 0
      },2000)
      
      trueThis.setState({
        dataString: JSON.parse(e.currentTarget.response).dataURL
      })
    })
    getRequest.addEventListener("progress", function(e){
      console.log('__get_progress__')
      if(e.lengthComputable) console.log(`
        loaded: ${e.loaded}
        totalLength: ${e.total}
        percentage: ${parseFloat((e.loaded / e.total)*100).toFixed(2)}%
      `)
      let pbar = document.querySelector('.progress-bar-fill')
      let container = document.querySelector('.progress-bar-component')
      let totalWidth = container.offsetWidth
      let ratioComplete = e.loaded/e.total
      pbar.style.width = totalWidth * ratioComplete + "px"
    })
    getRequest.open("GET", "/getimg");
    getRequest.send();
  }
  imgclick = (e) => {
    if(document.webkitFullscreenElement){
      e.target.style.height = "180px"
      document.webkitCancelFullScreen()
    } else {
      e.target.style.height = 'auto'
      e.target.webkitRequestFullScreen()
    }
  }
  clearImage = () => {
    document.querySelector('.progress-bar-fill').style.width = 0
    this.setState({ dataString: '' })}
  render() {
    // console.log(this.state)
    return (
      <div className="App">
        <h1>__react_image_uploader__</h1>
        <hr/>
        <button onClick={this.onclick}> check server </button>
        <button onClick={this.sendImgToServer}> upload image </button>
        <button onClick={this.getImageFromServer}> download image </button> 
        <button onClick={this.clearImage}> clear image </button>
        <hr/>
        <input type="file" onChange={this.handleInput}/>
        <div id="file-upload-button" onClick={_=>document.querySelector('[type="file"]').click()}>select image file</div>
        {this.state.showProgress && <ProgressBar/>}
        {this.state.dataString && 
        <img title="click to toggle fullscreen" onClick={this.imgclick} alt="preview" src={this.state.dataString} className="preview"></img>}
      </div>
    );
  }
}

export default App;
