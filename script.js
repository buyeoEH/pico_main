let dbUrl = "";

/*
config.txt 예시

https://picoproject-54545-default-rtdb.firebaseio.com
*/

fetch("config.txt")
    .then(response => {

        if (!response.ok) {
            throw new Error("config.txt를 찾을 수 없습니다.");
        }

        return response.text();
    })
    .then(text => {

        dbUrl = text.trim() + "/sensor_data.json";

        fetchSensorData();

        setInterval(fetchSensorData, 5000);
    })
    .catch(error => {

        console.error(error);

        document.getElementById("moistureStatus")
            .innerText = "설정 오류";
    });

function fetchSensorData(){

    if(!dbUrl) return;

    fetch(dbUrl)
        .then(response => response.json())
        .then(data => {

            if(!data) return;

            document.getElementById("moisturePercent")
                .innerText = data.soil_p + "%";

            document.getElementById("temperature")
                .innerText = data.temp + " ℃";

            document.getElementById("humidity")
                .innerText = data.hum + " %";

            document.getElementById("moistureRaw")
                .innerText = "센서 원본 값 : " + data.soil_r;

            const statusElement =
                document.getElementById("moistureStatus");

            if(data.soil_s == "1"){

                statusElement.innerText = "🌵 건조";
                statusElement.style.color = "#ff5252";

            }
            else if(data.soil_s == "2"){

                statusElement.innerText = "🌱 적정";
                statusElement.style.color = "#4caf50";

            }
            else{

                statusElement.innerText = "💧 과습";
                statusElement.style.color = "#2196f3";

            }

        })
        .catch(error => {

            console.error("데이터 읽기 실패", error);

            document.getElementById("moistureStatus")
                .innerText = "연결 실패";
        });
}
