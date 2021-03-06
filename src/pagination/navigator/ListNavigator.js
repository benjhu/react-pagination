import React from "react";
import createNavigator from "./createNavigator";

class ListWrapper extends React.Component {
    render() {
        return (
            <ul { ...this.props } />
        );
    }
}

const ListNavigator = createNavigator(params =>
    (
        <li>
            <a onClick={ params.action }>{ params.value }</a>
        </li>
    ), ListWrapper, "ListNavigator");

// A Navigator name is a string that ends with 'Navigator'.
// This way, the Paginator can recognize the Navigator and
// pass in the correct props.
ListNavigator.navigatorName = "ListNavigator";

export default ListNavigator;