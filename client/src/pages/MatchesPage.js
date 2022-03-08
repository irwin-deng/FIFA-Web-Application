import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,

} from 'antd'

import { getMatchSearch, getMatch } from '../fetcher'
import MenuBar from '../components/MenuBar';


class MatchesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            awayQuery: "",
            homeQuery: "",
            matchesResults: [],
            selectedMatchId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedMatchDetails: null

        }

        this.handleAwayQueryChange = this.handleAwayQueryChange.bind(this)
        this.handleHomeQueryChange = this.handleHomeQueryChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.goToMatch = this.goToMatch.bind(this)

    }



    handleAwayQueryChange(event) {
        this.setState({ awayQuery: event.target.value })
    }

    handleHomeQueryChange(event) {

    }
    goToMatch(matchId) {
        window.location = `/matches?id=${matchId}`
    }

    updateSearchResults() {

    }

    componentDidMount() {
        getMatchSearch(this.state.homeQuery, this.state.awayQuery, null, null).then(res => {
            this.setState({ matchesResults: res.results })
        })

        getMatch(this.state.selectedMatchId).then(res => {
            this.setState({ selectedMatchDetails: res.results[0] })
        })




    }

    render() {
		
    }
}

export default MatchesPage

