import React, {Component} from 'react'
import './FlyerForm.css'
import FlyersContext from '../../FlyersContext'
import {withRouter} from 'react-router-dom'
import DatePicker  from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ValidationError from '../ValidationError/ValidationError'
import { addYears } from 'date-fns'
import config from '../../config'
import FlyerApiService from '../../services/flyer-api-service'


class FlyerForm extends Component {
    state={
        id: '',
        title:  
        { value: '',
          touched: true  },
        location: '',
        image: {},
        eventstartdatetime: new Date(),
        eventenddatetime: new Date(),
        action: '',
        actiondate: new Date(),
        category: {value: ''},
        child: [],
        hideAddCategory: true,
        file: {},
        imageRequired: true,
    }

    static contextType = FlyersContext

    onTitleChange = (title) =>{
        this.setState({
            title: {
                value: title,
                touched: true
            }
        })
    }

    onLocationChange = (location) =>{

        this.setState({
            location: location
            
        })
    }

    onImageChange = (event) =>{
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0]
            this.setState({
            file: file
        })
        
  }
    
    getFileData= (resolve)=>{
        const reader  = new FileReader();
        reader.readAsDataURL(this.state.file)
        reader.onload = function(progressEvent){
            var url = reader.result
            resolve(url)
        }  
    }
      

    onEventStartDateChange = (eventDate) =>{
        
        this.setState({
            eventstartdatetime: eventDate,
            eventenddatetime: eventDate
        })
    }

    onEventEndDateChange = (eventDate) =>{
        if(eventDate < this.state.eventstartdatetime){

        }
        this.setState({
            eventenddatetime: eventDate
        })
    }

    onActionChange = (action) =>{
        this.setState({
            action: action
        })
    }
    onActionDateChange = (actionDate) =>{
        const formattedDate = actionDate.getMonth() + 1 + '/' + actionDate.getDate() + '/' + actionDate.getFullYear()
        this.setState({
            actiondate: formattedDate
        })
    }
    onCategoryChange = (category) =>{
        if(category === 'add-category'){
            this.setState({
                hideAddCategory: false
            })
        } else {
        this.setState({
            category: { 
                value: category, 
                touched: true}
        })
        
    }
    }

    onChildChange = (child) =>{

        var options = child
          var value = [];
                  for (var i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                      value.push(Number(options[i].value));
                    }
                  }
            this.setState({child: value}); 
                
    }

    handleNewCategory = (newCategory) =>{
        this.setState({
            category:{ value: newCategory}
        })
        this.context.onAddCategory(newCategory)
        const category = {value: newCategory}
        FlyerApiService.postCategory(category)
    }

    

    handleSubmit = (e) =>{
        e.preventDefault();

        const flyer = 
            {
                title: this.state.title.value,
                flyerimage: this.state.image,
                eventlocation: this.state.location,
                eventstartdate: this.state.eventstartdatetime,
                eventenddate: this.state.eventenddatetime,
                flyeraction: this.state.action,
                actiondate: this.state.actiondate,
                flyercategory: this.state.category.value,
                
            }
        
        let url;
        let fetchMethod;
        if(this.props.submissionType === 'add'){
            url = `${config.API_ENDPOINT}/flyers`
            fetchMethod = 'POST'
        }else {
            url = `${config.API_ENDPOINT}/flyers/${this.props.flyerid}`;
            fetchMethod = 'PATCH'
        }    

        FlyerApiService.postOrPatchFlyer(url, fetchMethod, flyer)
        .then(res => {
            
          if(!res.ok) {
            throw new Error(res.status)
          }

          if(this.props.submissionType === 'edit'){
            this.context.onEditFlyer(this.props.flyerid, flyer, this.props.history)
            
          }
          return res.json()
        })
        .then(flyer =>{
            console.log(flyer)
            
            let newFlyerChildren = []    
            const childrenToAdd = this.state.child
            if(childrenToAdd.length>0){
            for (let i=0; i<childrenToAdd.length; i++){
                let flyerChild = {
                    childid: childrenToAdd[i],
                    flyerid: flyer.id
                }
                newFlyerChildren.push(flyerChild)
            }

            FlyerApiService.postFlyersChildren(newFlyerChildren)
                .then(() =>{
                    this.context.onAddFlyer(flyer, newFlyerChildren, this.props.history) 
                    
                })    
            
            }
            else{
                this.context.onAddFlyer(flyer, newFlyerChildren, this.props.history) 
            }
            
        })
        .catch(error => this.setState({error}))
        
       
            
            
    }

    validateTitle(){
        const title = this.state.title.value.trim();
        if(title.length === 0)
        {
            return 'Title is required';
        }
        return 
    }

    validateCategory(){
    
        const category = this.state.category.value;
        
        if(category === '' || category === 'select'){
            return 'A valid category is required.'
        }
        return
    }

    validateEventEndDate(){
        const startDate = this.state.eventstartdatetime;
        const endDate = this.state.eventenddatetime;
        if(endDate < startDate){
            return 'The Event End Date/Time must be after the Event Start Date/Time'
        }
        return
    }

    componentDidMount(){
        if(this.props.submissionType === 'edit'){
            
            FlyerApiService.getFlyersChildrenByFlyerId(this.props.flyerid)
            .then((data)=>{
                    console.log(data)
                })
            
            const selectedFlyer = this.context.flyers.find((flyer) => flyer.id == this.props.flyerid)
            this.setState({
                title: {value: selectedFlyer.title, touched: true},
                location: selectedFlyer.location,
                image: selectedFlyer.image,
                eventstartdatetime: new Date(selectedFlyer.eventstartdate),
                eventenddatetime: new Date(selectedFlyer.eventenddate),
                action: selectedFlyer.action,
                actiondate: new Date(selectedFlyer.actiondate),
                category: {value: selectedFlyer.category},
                //child: selectedFlyer.childid
                hideAddCategory: true,
                //file: {},
                imageRequired: false

            })
        }
    }
    
    componentDidUpdate(prevProps, prevState){
        let currentComponent = this;
        
        if(this.state.file !== prevState.file){
            
            var promise = new Promise(this.getFileData);
            promise.then(function(data){
                const dataToPass = data
                currentComponent.setState({
                    image: dataToPass
                })
            }).catch(function(err){
                console.log('Error', err);
            });
         
        }

    }

    render(){
    
    const childOptions = this.context.children.map((child) => 
    <option key={child.id} value={child.id}>{child.childname}</option>
)
    const categoryOptions = this.context.categories.map((category) => <option key={category.category} value={category.category}>{category.category}</option>)    


    return(
    <form className="addflyer" id="newflyer" onSubmit={(e) => this.handleSubmit(e)}>
       <label htmlFor="title">Title</label> 
      
       <input id="title" type="text" required onChange={(e)=>this.onTitleChange(e.target.value)} value={this.state.title.value}/>
       
       <label htmlFor="location">Location</label> 
      
      <input id="location" type="text" required onChange={(e)=>this.onLocationChange(e.target.value)} value={this.state.location}/>

       <label htmlFor="imgfile">Flyer Image</label>
       <input id="last" type="file" accept="image/*,.pdf" required={this.state.imageRequired} onChange={(e) =>this.onImageChange(e)} files={this.state.image}/>
       
       <label htmlFor="eventstartdatetime">Event Start Date/Time</label>
       <DatePicker id="eventstartdatedate" 
        inline
        minDate={!this.state.eventstartdatetime? new Date() : this.state.eventstartdatetime}
        maxDate={addYears(new Date(),1)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa" selected={new Date(this.state.eventstartdatetime)} onChange={date =>{this.onEventStartDateChange(date)}}/>

        <label htmlFor="eventenddatetime">Event End Date/Time</label>
       <DatePicker id="eventenddatetime" 
        inline
        minDate={this.state.eventstartdatetime}
        maxDate={addYears(new Date(),1)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa" selected={new Date(this.state.eventenddatetime)} onChange={date =>{this.onEventEndDateChange(date)}}/>
       
       <label htmlFor="actiondate">Action Date</label>
       <DatePicker id="actiondate" inline selected={new Date(this.state.actiondate)} onChange={date =>{this.onActionDateChange(date)}}/>

       <label htmlFor="actiontype">Action</label>
       <input id="actiontype" type="text" onChange={(e)=>this.onActionChange(e.target.value)} value={this.state.action}/>
       <label htmlFor="category-select" hidden={!this.state.hideAddCategory}>Select Catgory</label>
       
       <select id="category-select" onChange={(e)=>this.onCategoryChange(e.target.value)} hidden={!this.state.hideAddCategory} value={this.state.category.value.toLowerCase()}>
       <option value="select">Choose an option</option>
        {categoryOptions}
        <option value="add-category">Add Category</option>
        </select>
        <div hidden={this.state.hideAddCategory}>
        <label htmlFor="add-category" >Add Category</label>
        <input type="text" id="add-category" onBlur={(e)=>this.handleNewCategory(e.target.value)}/>
        </div>
        <label htmlFor="student-select">Select One or More Students</label>
        <select id="student-select" multiple size="4" onChange={(e)=>this.onChildChange(e.target.options)} >
            <option value="select">Choose an option</option>
            {childOptions}
        </select>

        {this.state.title.touched && (<ValidationError message={this.validateTitle()}/>)}
        <ValidationError message={this.validateCategory()}/>
        <ValidationError message={this.validateEventEndDate()}/>
       <button type="submit" disabled={this.validateTitle() || this.validateCategory() || this.validateEventEndDate()}>Submit</button>
       <button type="reset" onClick={() => this.props.history.push('/flyers')}>Cancel</button>
    </form>

    )
    }



}
export default withRouter(FlyerForm)