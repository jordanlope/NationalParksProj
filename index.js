'use strict';

const apiKey = '7fkYqe5lFh5AG7K1hNU9EP6VBd548UPibUkgMltd'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

    function formatQueryParams(params) {
        const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
    }

    function formatStates(states) {
        const val = states.replace(',', '');
        console.log(val.length);
        const statesArray = [];
        if(val.length % 2 == 0) {
            const maxStates = val.length / 2;
            console.log(maxStates);
            for(let i = 0; i <= maxStates; i+=2) {
                const state = val[i] + val[i+1];
                statesArray.push(`${encodeURIComponent(state)}`);
                console.log(statesArray);
            }
            console.log(statesArray);
            return statesArray;
        } else {
            return statesArray;
        }
    }

    function renderParkLocations(locations) {
        $('#results-list').empty();
        console.log(locations.data.length);
        for(let i = 0; i < locations.data.length; i++) {
            console.log(locations.data[i].fullName);
            console.log(locations.data[i].description);
            console.log(locations.data[i].url);
            $('#results-list').append(
                `<li>
                    <p>${locations.data[i].fullName}</p>
                    <p>${locations.data[i].description}</p>
                    <a href='${locations.data[i].url}'>${locations.data[i].url}</a>
                </li>`
            )
        };

        $('#results').removeClass('hidden');

    }

    function getParkLocations(states, maxResults=10) {
    const statesArray = formatStates(states);
    const params = {
        api_key: apiKey,
        stateCode: statesArray,
        limit: maxResults
    };
    
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => renderParkLocations(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    }

    function watchForm() {
        $('form').submit(event => {
          event.preventDefault();
          const searchTerm = $('#js-search-term').val();
          const maxResults = $('#js-max-results').val();
          
          getParkLocations(searchTerm, maxResults);

          $('#js-search-term').val("");
        });
    }

    $(watchForm);