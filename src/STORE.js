

export default {
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
        image: require('../src/Corn-Maze-Flyer.jpg'),
        eventdate: "10/15/19 15:30",
        actiondate: "10/10/19",
        action: "RSVP",
        category: "School",
        childid: [2]
    },
    {
        id: 2,
        title: "Field Trip",
        image: require('../src/after-school-flyer.jpg'),
        eventdate: "11/13/19 13:00",
        actiondate: "9/5/19",
        action: "Send Permission Slip",
        category: "School",
        childid: [1,2]
    },
    {
        id: 3,
        title: "Camping",
        image: require('../src/scoutcamping.jpg'),
        eventdate: "9/3/19 9:30",
        actiondate: "8/20/19",
        action: "Pay",
        category: "Scouts",
        childid: [3]
    },
],
categories: ['scouts', 'school', 'gymnastics'],
users: [

],


}
