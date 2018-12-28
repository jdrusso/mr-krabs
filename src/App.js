import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


export const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Enter an item name and click Submit to calculate manufacturing requirements.
      </p>
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <NameForm />
      </MuiThemeProvider>
    </header>
  </div>
);



async function get_minerals(callback)
{

    console.log("Querying mineral multibuy")
    const response = await fetch('http://127.0.0.1:5000/multibuy_minerals', { credentials: 'include'});
    // console.log(response);
    const minerals = response.json();
    console.log("Got mineral response")
    console.log(minerals);

    let mineral_result = minerals.then(data => callback(data));

    mineral_result.then(() => console.log(minerals.json));
}

async function get_ore(callback)
{

  console.log("Querying ore multibuy")
  const response = await fetch('http://127.0.0.1:5000/multibuy_ore', { credentials: 'include'});
  // console.log(response);
  const ore = response.json();
  console.log("Got ore response");
  console.log(ore);
  ore.then(data => callback(data));

}


export class Multibuy extends Component {

  state = {}

  clearSession() {

    console.log("Clearing session")
    fetch('http://127.0.0.1:5000/clear', { credentials: 'include'});
    // console.log(this);
    // delete this.state;
    this.setState({minerals: false, ore: false});
    // console.log(this);

  }

  componentDidMount() {
    const self = this;
    // console.log("Clearing session");
    // fetch('http://127.0.0.1:5000/clear', { credentials: 'include'});

    // Can't do this until after submit is clicked!
    // Or, need to get a response first
    self.setState({a: "test"});
    console.log(this.state);
    get_minerals(data => self.setState({ minerals: data }));
    get_ore(data => self.setState({ ore: data }));
  }

  render(){

    return(
      <div>

      <RaisedButton label="Clear" onClick={this.clearSession.bind(this)} />

      {
        this.state && this.state.minerals && this.state.ore &&
      <div className="parent">
        <div className="child inline-block-child">
        <Card  initiallyExpanded={true}>
          <CardHeader actAsExpander={true} showExpandableButton={true}
          title="Multibuy (Minerals)"/>
            <CardText  expandable={true}> <code> {this.state.minerals} </code> </CardText>
          </Card>
        </div>&nbsp;
        <div className="child inline-block-child">
        <Card  initiallyExpanded={true}>
        <CardHeader actAsExpander={true} showExpandableButton={true}
        title="Multibuy (Ore)"/>
          <CardText expandable={true}> <code> {this.state.ore} </code> </CardText>
          </Card>
        </div>
      </div>
  }
  </div>
);}}

export class NameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        response: '',
        post: '',
        item_name: '',
        item_quantity: '1',
        responseToPost: '',
        processing: false,
        minerals: '',
      };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


    fetch('http://127.0.0.1:5000/clear', { credentials: 'include'});

  }

  handleChange(event) {
    this.setState({test: event.target.value});
  }


  getMinerals = async() => {
    var minerals = "1x tritanium";
    return minerals;
  };

  handleSubmit = async e => {
    e.preventDefault();

    var data = {};
    data.item = this.state.item_name;
    data.quantity = this.state.item_quantity;
    console.log("Sending submit");
    const response = await fetch('http://127.0.0.1:5000/post_test', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { data }),
    });
    console.log("Response:");
    console.log(response);
    const body = await response.text();
    // const response_json = response.json()
    console.log(body)
    // body.then(() => console.log("Finished"));
    this.setState({ responseToPost: body });

    this.setState({ processing: true});
  };

  render() {

    return (
      <>
      <form onSubmit={this.handleSubmit}>
        <label>
          Item name:
        </label>
        <TextField id="itemField" hintText="Rifter" type="text"
          value={this.state.item_name}
          onChange={e => this.setState({item_name: e.target.value})}
          style = {{width: 150, "marginLeft":5, "marginRight":20}}/>

        <label>
          Quantity:
        </label>
        <TextField type="text" id="quantityField"
          value={this.state.item_quantity}
          onChange={e => this.setState({item_quantity: e.target.value})}
          style = {{width: 20, "marginLeft":5, "marginRight":25}}/>

          <RaisedButton type="submit" label="Submit" />

      </form>
      <p>{this.state.responseToPost}</p>

      <Multibuy/>
      </>
    );
  }
}


// export default App;