import React from 'react'
import FlyerList from './FlyerList'
import {BrowserRouter } from 'react-router-dom'
import {shallow} from 'enzyme'
import toJson from 'enzyme-to-json'



describe('FlyerList component', ()=>{

    const context = {
        "children" : [
            {
                id: 1,
                name: "Dick",
            },
            {
                id: 2,
                name: "Sally",
            },
            {
                id: 3,
                name: "Jane",
            },
        ],
        "flyers": [
            {
                id: 1,
                title: "Corn Maze",
                image: require('../Corn-Maze-Flyer.jpg'),
                eventdate: "10/15/19",
                actiondate: "10/10/19",
                action: "RSVP",
                category: "School",
                childid: [2]
            },
            {
                id: 2,
                title: "Field Trip",
                image: require('../after-school-flyer.jpg'),
                eventdate: "11/13/19",
                actiondate: "9/5/19",
                action: "Send Permission Slip",
                category: "School",
                childid: [1,2]
            },
            {
                id: 3,
                title: "Camping",
                image: require('../scoutcamping.jpg'),
                eventdate: "9/3/19",
                actiondate: "8/20/19",
                action: "Pay",
                category: "Scouts",
                childid: [3]
            },
        ],
        categories: ['scouts', 'school', 'gymnastics'],
    }

it('renders a FlyersList by default', () =>{
    const wrapper = shallow(<BrowserRouter><FlyerList/></BrowserRouter>, context)
    expect(toJson(wrapper)).toMatchSnapshot()
})

})
