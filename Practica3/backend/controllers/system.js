const conn = require('../database/conection.js');

const cpu = async (req, res) => {
    console.log("Peticion cpu")
    conn.query('select CPU_json from Info_cpu order by ID desc limit 1;',
        function (err, result, fields) {
            if (err) console.log(err);
            //console.log(result[0].CPU_json)
            res.status(200).json(JSON.parse(result[0].CPU_json))
        }
    );
};

    const ram = async (req, res) => {
        console.log("Peticion ram")
        conn.query('select Ram_json from Info_ram order by ID desc limit 1;',
            function (err, result, fields) {
                if (err)  console.log(err);
                //console.log(result[0].Ram_json)
                res.status(200).json(JSON.parse(result[0].Ram_json))
            }
        );
    };

    module.exports = {
        cpu,
        ram
    };