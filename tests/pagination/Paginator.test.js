import React from "react";
import ReactDOM from "react-dom";
import { Paginator, ListNavigator } from "../../src/ReactPagination";
import data from "../data/data.json";

const config = {
    itemsPerPage: 50
};

export class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.changeData  = this.changeData.bind(this);

        this.state = {
            data: Promise.resolve(null)
        };
    }

    changeData() {
        Promise.resolve(this.state.data)
            .then(data => {
                this.setState({
                    data: Promise.resolve(data.map(entry => {
                        return { id: entry.id, data: entry.data.concat(": ", entry.id) };
                    }))
                });
            });
    }

    componentDidMount() {
        this.setState({ data: this.props.data });
    }

    render() {
        return (
            <div>
                <Paginator config={ config } promise={ this.state.data }>
                    {
                        param => (
                            <div>
                                { param.id ? param.id : "NO_ID" }
                                { param.data }
                            </div>
                        )
                    }
                    <button type="button" onClick={ this.changeData }>Change Data</button>
                    <ListNavigator />
                </Paginator>
            </div>
        );
    }
}