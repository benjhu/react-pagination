import React from "react";
import { NavigatorBase } from "./NavigatorBase";

export default (fn, WrapWith, navigatorName) => {
    class CustomNavigator extends React.Component {
        render() {
            const insides = (
                <NavigatorBase { ...this.props }>{ fn }</NavigatorBase>
            );

            if (WrapWith)
                return (
                    <WrapWith>{ insides }</WrapWith>
                );

            return insides;
        }
    }

    // Default name for this Navigator.
    // The user can redefine it after calling the createNavigator()
    // function.
    CustomNavigator.navigatorName = navigatorName ? navigatorName : "CustomNavigator";

    return CustomNavigator;
};