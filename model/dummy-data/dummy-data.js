let insertAccreditedVoters = db => {
    let accredited_voters={
        "+2348141599763": {
            "name": "Chia Nguher Gabriel",
            "matric no": "2031600030",
            "email": "Gabrielsonchia@gmail.com"
        },
        "+2347038553679": {
            "name": "Nneke Valentine Edozie",
            "matric no": "2031600035",
            "email": "Nneke@gmail.com"
        },
        "+2348182798166": {
            "name": "Timothy Gabriel",
            "matric no": "2031600044",
            "email": "timo@gmail.com"
        },
        "+2347035950830": {
            "name": "Joy Salma",
            "matric no": "2032600013",
            "email": "Salma@gmail.com"
        },
        "+2349096295636": {
            "n ame": "Agbo Juliet",
            "matric no": "2031600035",
            "email": "Agbo@gmail.com"
        }
    };
   return db.collection("nacoss").doc("accredited voters").set(accredited_voters);
}

let insertContestants = db => {
    let contestants = {
        "president": {
            "1": {
                "name":"gabriel",
                "matric No":"2031600030"
            },
            "2": {
                "name":"timo",
                "matric no":"2031600044"
            },
            "3": {
                "name":"kefas",
                "matric no":"2031600003"
            },
            "4": {
                "name":"val",
                "matric no":"2031600035"
            },
            "5": {
                "name":"sam",
                "matric no":"2031600002"
            },
            "6": {
                "name":"glory",
                "matric no":"2031600004"
            },
            "7": {
                "name":"ibro",
                "matric no":"2031600005"
            },
            "8": {
                "name":"faeren",
                "matric no":"2031600006"
            },
            "9": {
                "name":"tunde",
                "matric no":"2031600007"
            },
            "10": {
                "name":"christy",
                "matric no":"2031600008"
            },
            "11": {
                "name":"believe",
                "matric no":"2031600009"
            }
        },
        "vice piesident": {
            "1": {
                "name":"Juli",
                "matric":"2031600009"
            },
            "2": {
                "name":"Joy",
                "matric":"2031600013"
            }
        }
    };
   return db.collection("nacoss").doc("contestants").set(contestants);
}

let insertPositions = db => {
    let positions = ["president","vice president","public relations officer",
                "financial secretary","treasurer","secretary general",
                "sports director","senator","provost","academic officer",
                "welfare director"];
   return db.collection("nacoss").doc("positons").set(positions);
}

let insertPresident = db => {
    let president = {
        "1":{
            "no of votes": 0
        },
        "2":{
            "no of votes": 0
        },
        "3":{
            "no of votes": 0
        },
        "4":{
            "no of votes": 0
        },
        "5":{
            "no of votes": 0
        },
        "6":{
            "no of votes": 0
        },
        "7":{
            "no of votes": 0
        },
        "8":{
            "no of votes": 0
        },
        "9":{
            "no of votes": 0
        },
        "10":{
            "no of votes": 0
        },
        "11":{
            "no of votes": 0
        }
    };
    for(id in president){
       return db.collection("president").doc(id).set(president[id])
    }
}

let insertVicePresident = db => {
    let vice_president = {
        "1": {
            "no of votes":0
        },
        "2": {
            "no of votes":0
        }
    };
    for(id in vice_president){
       return db.collection("president").doc(id).set(vice_president[id])
    }
}

let insertVotes = db => {
    let votes = {
        "+2347038553679":{
            "1":"president",
            "2":"vice president",
            "3":"public relations officer",
            "4":"financial secretary",
            "5":"treasurer",
            "6":"secretary general",
            "7":"sports director",
            "8":"senator",
            "9":"provost",
            "10":"academic officer",
            "11":"welfare director"
        },
        "+2347035950830":{
            "1":"president",
            "2":"vice president",
            "3":"public relations officer",
            "4":"financial secretary",
            "5":"treasurer",
            "6":"secretary general",
            "7":"sports director",
            "8":"senator",
            "9":"provost",
            "10":"academic officer",
            "11":"welfare director"
        },
        "+2348141599763":{
            "1":"president",
            "2":"vice president",
            "3":"public relations officer",
            "4":"financial secretary",
            "5":"treasurer",
            "6":"secretary general",
            "7":"sports director",
            "8":"senator",
            "9":"provost",
            "10":"academic officer",
            "11":"welfare director"
        },
        "+2348182798166":{
            "1":"president",
            "2":"vice president",
            "3":"public relations officer",
            "4":"financial secretary",
            "5":"treasurer",
            "6":"secretary general",
            "7":"sports director",
            "8":"senator",
            "9":"provost",
            "10":"academic officer",
            "11":"welfare director"
        },
        "+2349096295636":{
            "1":"president",
            "2":"vice president",
            "3":"public relations officer",
            "4":"financial secretary",
            "5":"treasurer",
            "6":"secretary general",
            "7":"sports director",
            "8":"senator",
            "9":"provost",
            "10":"academic officer",
            "11":"welfare director"
        },
    }
    for(id in votes){
       return db.collection("president").doc(id).set(votes[id])
    }
}

let insertData = (db) => {
    insertAccreditedVoters(db);
    insertContestants(db);
    insertPositions(db);
    insertPresident(db);
    insertVicePresident(db);
    insertVotes(db)
}

module.exports.insertData = insertData;
