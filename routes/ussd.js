const express = require('express');
const UssdMenu = require('ussd-menu-builder');
const queries = require('../model/firebase/queries');
const menu = new UssdMenu();
const router = express.Router();


let sessions = {};
//session configurations
menu.sessionConfig({
    start: (sessionId, callback) => {
        // initialize current session if it doesn't exist
        // this is called by menu.run()
        if (!(sessionId in sessions)) sessions[sessionId] = {};
        callback();
    },
    end: (sessionId, callback) => {
        // clear current session
        // this is called by menu.end()
        delete sessions[sessionId];
        callback();
    },
    set: (sessionId, key, value, callback) => {
        // store key-value pair in current session
        sessions[sessionId][key] = value;
        callback();
    },
    get: (sessionId, key, callback) => {
        // retrieve value by key in current session
        let value = sessions[sessionId][key];
        callback(null, value);
    }
});

//landing page
menu.startState({
    run: function () {
        //getting list of positions from firebase
        let response = queries.getDoc("faculty of science", "positions")
            .then(result => {
                let { positions } = result;
                let currentMenu = [];
                let posts = "";
                let indexOfLastElement = 0;
                //persisting positions throughout the session
                menu.session.set('positions', positions)
                    .then(() => {
                        return positions
                    }).catch(error => {
                        if (error) console.log("Error", error)
                    })
                //selecting positions to display to phoneNumber    
                for (let index = 0; index < 7; index++) {
                    posts += `\n${index + 1}. ${positions[index]}`
                    indexOfLastElement++;
                    //persisting content of page to be diplayed to phoneNumber 
                    menu.session.set('currentMenu', currentMenu)
                        .then(() => {
                            currentMenu.push(positions[index]);
                        }).catch(error => {
                            if (error) console.log("Error", error)
                        })
                }
                if (positions.length > currentMenu.length) {
                    posts += `\n99. next`;
                }
                //index of the last element selected
                menu.session.set('indexOfLastElement', indexOfLastElement)
                    .then(() => {
                        return indexOfLastElement
                    }).catch(error => {
                        if (error) console.log("Error", error)
                    })
                return posts
            })
            .catch(error => {
                if (error) console.log("Error", error)
            })
        //displaying result to phoneNumber
        response.then(result => {
            menu.con(`Welcome ${menu.args.userName}` +
                `\nSelect an Office` +
                result);
        }).catch(error => {
            if (error) console.log("Error", error)
        })
    },
    next: {
        '*^[1-7]$': 'getContestants',
        '99': 'getNextPosition',
    }
});

//handing request for more Positions
menu.state('getNextPosition', {
    run: function () {
        let response = "";
        //retrieving content of current page 
        menu.session.get('currentMenu')
            .then(result => {
                let previousMenu = [];
                if (result.length < 7) {
                    //routing back to landing page
                    return menu.goStart();
                }
                //Assigning content of current page
                menu.session.set('previousMenu', previousMenu)
                    .then(() => {
                        result.forEach((element) => {
                            previousMenu.push(element);
                        })
                        //deleting content of current page
                        result.splice(0, result.length);
                        //retrieving Index of Last Element
                        menu.session.get('indexOfLastElement')
                            .then(lastIndex => {
                                //retrieving list of positions
                                response = menu.session.get('positions')
                                    .then((result) => {
                                        let post = "";
                                        let currentMenu = [];
                                        let tester = 0;
                                        tester = lastIndex + 7;
                                        //selecting positions to display to phoneNumber   
                                        for (let index = lastIndex; index < tester; index++) {
                                            if (index === result.length) {
                                                lastIndex--;
                                                break
                                            }
                                            post += `\n${index + 1}. ${result[index]}`
                                            //persisting content of page to be diplayed to phoneNumber 
                                            menu.session.set('currentMenu', currentMenu)
                                                .then(() => {
                                                    currentMenu.push(result[index]);
                                                }).catch(error => {
                                                    if (error) console.log("Error", error)
                                                })
                                            lastIndex++
                                        }
                                        if (result.length > tester) {
                                            post += `\n0. back`
                                            post += `\n99. next`;
                                        } else {
                                            post += `\n0. back`
                                        }
                                        //index of the last element selected
                                        menu.session.set('indexOfLastElement', lastIndex)
                                            .then(() => {
                                                return lastIndex;
                                            }).catch(error => {
                                                if (error) console.log("Error", error)
                                            })
                                        return post;
                                    }).catch(error => {
                                        if (error) console.log("Error", error)
                                    })
                                //displaying result to phoneNumber
                                response.then(result => {
                                    menu.con(`Select an Office` +
                                        result);
                                })
                            })
                            .catch(error => {
                                if (error) console.log("Error", error)
                            })
                    }).catch(error => {
                        if (error) console.log("Error", error);
                    })

            }).catch(error => {
                if (error) console.log("Error", error);
            })
    },
    next: {
        '[8-9]': 'getContestants',
        '99': 'getNextPosition',
        '0': 'previousPosition'
    }
})

//handling request for previously lsited positions
menu.state('previousPosition', {
    run: function () {
        //retrieving content of current page 
        menu.session.get('currentMenu')
            .then(result => {
                let post = "";
                //retrieving Index of Last Element
                menu.session.get('indexOfLastElement')
                    .then(index => {
                        index -= 7;
                        if (index <= 7) {
                            //routing back to landing page
                            menu.goStart();
                            return
                        }
                        else {
                            //retrieving content of previous page
                            menu.session.get('previousMenu')
                                .then(value => {
                                    let currentMenu = [];
                                    let inc = index;
                                    value.forEach(element => {
                                        post += `${inc + 1}. ${element}\n`;
                                        inc++;
                                    })
                                    result.forEach(element => {
                                        //persisting content of page to be diplayed to phoneNumber 
                                        menu.session.set('currentMenu', currentMenu)
                                            .then(() => {
                                                return currentMenu.push(element)
                                            }).catch(error => {
                                                if (error) console.log("Error", error)
                                            })
                                    })
                                    //index of the last element selected
                                    menu.session.set('indexOfLastElement', index)
                                        .then(() => {
                                            return index - 1;
                                        }).catch(error => {
                                            if (error) console.log("Error", error)
                                        })
                                    post += `0. back\n` +
                                        `99. next`;
                                    menu.con(`Select an Office` +
                                        post);
                                }).catch(error => {
                                    if (error) console.log("Error", error)
                                })
                        }
                    }).catch(error => {
                        if (error) console.log("Error", error)
                    })

            }).catch(error => {
                if (error) console.log("Error", error);
            })
    },
    next: {
        '*\d*': 'getContestants',
        '99': 'getNextPosition',
        '0': 'previousPosition'
    }
})

//handling request for Contestants
menu.state('getContestants', {
    run: function () {
        let value = menu.args.text;
        let positionId = menu.val;
        let counter = 1;
        let idOfLastContestant = 0;
        let contestant = [];
        let previousMenu = [];
        let currentMenu = [];
        let contestants = "";
        let cont = "";

        menu.session.set('positionId', positionId)
            .then(() => {
                return positionId
            });
        //getting constestants from firebase
        queries.getDoc("faculty of science", "contestants")
            .then(result => {
                let index = Number(value.charAt(value.length - 1))
                //selecting route based of user's selection
                if (/.\d\*(0)$/.test(value) || /\d\*(0)$/.test(value) || /.(0)\*(0)$/.test(value)) {
                    if (/.(0)\*(0)$/.test(value)) {
                        menu.goStart();
                    }
                    else {
                        let response = menu.session.get('previousMenu')
                            .then(reply => {
                                let post = '';
                                let inc = 1;
                                reply.forEach(element => {
                                    post += `${inc}. ${element}\n`;
                                    menu.session.set('currentMenu', currentMenu)
                                        .then(() => { currentMenu.push(element) });
                                    inc++;
                                })
                                post += `99. next\n` +
                                    `0. back`
                                return post;
                            }).catch(error => {
                                if (error) console.log("Error", error)
                            })
                        return response.then(result => {
                            menu.con(`Welcome ${menu.args.userName}\n` +
                                `Select an Office\n` +
                                result);
                        }).catch(error => {
                            if (error) console.log("Error", error)
                        })
                    }
                }
                else if (/.\d\*(99)\*(0)$/.test(value) || /\d\*(99)\*(0)$/.test(value)) {
                    menu.session.get('currentMenu')
                        .then(reply => {
                            reply.forEach(element => {
                                previousMenu.push(element);
                            })
                        }).catch(error => {
                            if (error) console.log("Error", error)
                        })
                    //retrieving Index of Last Element
                    menu.session.get('previousMenu')
                        .then(reply => {
                            for (let [key, value] of reply) {
                                cont += `${key}. ${value.name} \n`;
                                menu.session.set('currentMenu', contestant)
                                    .then(() => {
                                        contestant.push([key, value])
                                    }).catch(error => {
                                        if (error) console.log("Error", error)
                                    })
                                counter++;
                            }
                            idOfLastContestant = counter--;
                            //Id of last contestant
                            menu.session.set('idOfLastContestant', idOfLastContestant)
                                .then(() => {
                                    return idOfLastContestant;
                                }).catch(error => {
                                    if (error) console.log("Error", error)
                                })

                            cont += `99. next\n` +
                                `0. back`
                            menu.con(`Select your candidate below\n` +
                                cont);
                        }).catch(error => {
                            if (error) console.log("Error", error)
                        })
                } else {
                    //retrieving List of Positions
                    menu.session.get('positions')
                        .then(reply => {
                            let position = reply[index - 1];
                            if (result[position]) {
                                contestants = Object.entries(result[position]);

                                menu.session.get('currentMenu')
                                    .then(reply => {
                                        reply.forEach(element => {
                                            menu.session.set('previousMenu', previousMenu)
                                                .then(() => {
                                                    return previousMenu.push(element)
                                                })
                                        })
                                    })
                                for (let [key, value] of contestants) {
                                    if (counter === 8) {
                                        cont += `99. next \n`
                                        break;
                                    }
                                    else {
                                        cont += `${key}. ${value.name} \n`;
                                        //persisting content of page to be diplayed to phoneNumber 
                                        menu.session.set('currentMenu', contestant)
                                            .then(() => {
                                                contestant.push([key, value])
                                            })
                                        counter++;
                                    }
                                };
                                idOfLastContestant = counter--;
                                //Id of last contestant
                                menu.session.set('idOfLastContestant', idOfLastContestant)
                                    .then(() => {
                                        return idOfLastContestant;
                                    })
                                //List of contestants
                                menu.session.set('contestants', contestants)
                                    .then(() => {
                                        return contestants
                                    });
                                cont += `0. back`
                                menu.con(`Select your candidate below\n` +
                                    cont)
                            } else {
                                menu.end(`The selected office has no contestants`)
                            }
                            ;
                        })
                }
            }).catch(error => {
                if (error) console.log("Error", error)
            })
    },
    next: {
        '*[1-7]': function () {
            let value = menu.args.text;
            if (/.(0)\*(0)\*\d$/.test(value)) {
                return 'getContestants'
            } else {
                return 'vote'
            }
        },
        '99': function () {
            let value = menu.args.text;
            if (/.\d\*(0)\*(99)/.test(value) || /\d\*(0)\*(99)/.test(value) || /.(0)\*(0)\*(99)/.test(value)) {
                return 'getNextPosition'
            } else {
                return 'getMoreContestants'
            }
        },
    }
})
//handling request for more Contestants
menu.state('getMoreContestants', {
    run: function () {
        let previousMenu = [];
        let currentMenu = [];

        menu.session.get('currentMenu')
            .then(reply => {
                reply.forEach(element => {
                    previousMenu.push(element[1].name);
                })
            })
        menu.session.set('previousMenu', previousMenu)
            .then(() => {
                return previousMenu
            })
        //retrieving list of contestants
        menu.session.get('contestants')
            .then(reply => {
                //Id of last contestant from the previous page
                menu.session.get('idOfLastContestant')
                    .then(result => {
                        let value = menu.val;
                        let cont = "";
                        let idOfNextContestant = result + 1;
                        let counter = idOfNextContestant + 7;
                        let idOfLastContestant = 0;
                        let contestant = [];
                        // if()
                        for (let element = idOfNextContestant; element < reply.length; element++) {
                            if (element === counter) {
                                idOfLastContestant = element--;
                                //Id of last contestant
                                menu.session.set('idOfLastContestant', idOfLastContestant)
                                    .then(() => {
                                        return idOfLastContestant;
                                    }).catch(error => {
                                        if (error) console.log("Error", error)
                                    })
                                cont += `99. next \n`
                                break;
                            }
                            else {
                                contestant = reply[element]
                                cont += `${contestant[0]}. ${contestant[1].name} \n`;
                                currentMenu.push(contestant);
                                element++
                            }
                        };
                        menu.session.set('currentMenu', currentMenu)
                            .then(() => {
                                return currentMenu
                            });
                        cont += `0. back`
                        menu.con(`Select your candidate below\n` +
                            cont);
                    }).catch(error => {
                        if (error) console.log("Error", error)
                    })
            }).catch(error => {
                if (error) console.log("Error", error)
            })
    },
    next: {
        '*^([8-9]|[1234][0-9]|(50))$': 'vote',
        '99': 'getMoreContestants',
        '0': 'getContestants',
    }
})
//handling request to confirm vote
menu.state('vote', {
    run: function () {
        let contestantId = menu.val;
        menu.session.set('contestantId', contestantId)
            .then(() => {
                return contestantId;
            });
        menu.session.get('currentMenu')
            .then(result => {
                let value = menu.val;
                let contestantId = null;
                if (value <= 7) {
                    contestantId = value - 1;
                    constestantName = [[result[contestantId][1].name]];
                } else {
                    contestantId = value[value.length - 1];
                    constestantName = [[result[contestantId][1].name]];
                }
                menu.con(`You are about to vote for ${constestantName}.\n` +
                    `Confirm to proceed\n` +
                    `1. Proceed\n` +
                    `2. Cancel\n`);
            })
    },
    next: {
        '1': 'vote.proceed',
        '2': function () {
            return menu.end(`Thank you for your participation.\n` +
                `An SMS containing the final result will be sent to \n` +
                `you after the elections`);
        }
    }
})
//updating database
menu.state('vote.proceed', {
    run: function () {
        let db = queries.db;
        let phoneNumber = menu.args.phoneNumber
        const postsRef = db.collection('votes').doc(phoneNumber);
        let positionsRef = null;
        let test = null;
        const positionId = () => {
            return new Promise((res, rej) => {
                menu.session.get('positionId')
                    .then(id => {
                        res(id)
                    }).catch((error) => {
                        console.log('error:', error);
                    });
            }).catch((error) => {
                console.log('error:', error);
            });
        }
        const contestantId = () => {
            return new Promise((res, rej) => {
                menu.session.get('contestantId')
                    .then(response => {
                        res(response)
                    }).catch((error) => {
                        console.log('error:', error);
                    });
            }).catch((error) => {
                console.log('error:', error);
            });
        }
        const getVotes = async (t, ref) => {
            return new Promise(async (res, rej) => {
                t.get(ref)
                    .then(async reply => {
                        let dataSet = reply.data();
                        dataSet['no of votes'] += 1
                        res(dataSet);
                    }).catch((error) => {
                        console.log('error:', error);
                    });
            }).catch((error) => {
                console.log('error:', error);
            });
        }
        const getPosition = async (t, ref) => {
            return new Promise(async (res, rej) => {
                await positionId()
                    .then(id => {
                        t.get(ref)
                            .then(async result => {
                                let positions = result.data();
                                let position = positions[id];
                                test = position;
                                if (position) {
                                    await contestantId()
                                        .then(response => {
                                            return positionsRef = db.collection(position)
                                                .doc(response);
                                        }).catch((error) => {
                                            console.log('error:', error);
                                        });
                                    res({ positions, position, id })
                                } else {
                                    menu.end(`You have already voted for this office`);
                                    rej(`You have already voted for this office`)
                                }
                            }).catch((error) => {
                                console.log('error:', error);
                            });
                    }).catch((error) => {
                        console.log('error:', error);
                    });
            }).catch((error) => {
                console.log('error:', error);
            });
        }

        const update = async (t) => {
            return new Promise(async (res, rej) => {
                let result = await getPosition(t, postsRef)
                if (test) {
                    let positions = result.positions
                    let id = result.id
                    let updateVotes = await getVotes(t, positionsRef);
                    delete positions[id];
                    res({ updateVotes, positions })
                }
            }).catch((error) => {
                console.log('error:', error);
            });
        }

        db.runTransaction(t => {
            return update(t).then(result => {
                if (test) {
                    let { updateVotes, positions } = result;
                    let value = updateVotes['no of votes']
                    t.update(positionsRef, { 'no of votes': value });
                    t.set(postsRef, positions);
                }
            })
        }).then(result => {
            menu.end(`Your vote(s) have being submited successfully.\n` +
                `Thanks for your participation`)
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
        });


    }
})
menu.on('error', err => {
    // handle errors
    console.log(err);
});

router.post('*', async (req, res) => {
    let args = {
        phoneNumber: req.body.phoneNumber,
        sessionId: req.body.sessionId,
        serviceCode: req.body.serviceCode,
        text: req.body.text,
        userName: req.body.user
    };
    let resMsg = await menu.run(args);
    res.send(resMsg);
});

module.exports = router;
