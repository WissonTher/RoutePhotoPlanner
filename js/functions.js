function updateRouteStats(trackLayer, photoMarkersCount = 0) {
    if (!trackLayer) return;

    var distanceMeters = trackLayer.get_distance() || 0;
    var elevationGain = trackLayer.get_elevation_gain() || 0;
    var elevationLoss = trackLayer.get_elevation_loss() || 0;

    var timeFromDistance = (distanceMeters / 1000) * 15;        // 15 minut na kilometr
    var timeFromGain = (elevationGain / 100) * 10;              // 10 minut na 100 metrów podejścia
    var timeFromLoss = (elevationLoss / 100) * 5;               // 5 minut na 100 metrów zejścia
    var timeFromWalking = timeFromDistance + timeFromGain + timeFromLoss;

    var walkingHours = Math.floor(timeFromWalking / 60);
    var walkingMinutes = Math.round(timeFromWalking % 60);

    if (walkingMinutes === 60) {
        walkingHours += 1;
        walkingMinutes = 0;
    }

    var walkingTimeString = (walkingHours > 0 ? walkingHours + " godz. " : "") + walkingMinutes.toString().padStart(2, "0") + " min.";

    document.getElementById("route-info").style.display = "block";
    document.getElementById("estimated-time").textContent = walkingTimeString;
    document.getElementById("distance").textContent = (distanceMeters / 1000).toFixed(2);
    document.getElementById("approaches").textContent = Math.round(elevationGain);
    document.getElementById("descents").textContent = Math.round(elevationLoss);

    if (photoMarkersCount > 0) {
        var timeFromPhoto = parseInt(document.getElementById("photo-time-input").value) || 0;
        var numOfPhotos = parseInt(document.getElementById("photo-number-input").value) || 0; 

        var totalPhotoSeconds = photoMarkersCount * timeFromPhoto;
        var totalPhotoMinutes = totalPhotoSeconds / 60;

        var photoHours = Math.floor(totalPhotoMinutes / 60);
        var photoMinutes = Math.round(totalPhotoMinutes % 60);
        if (photoMinutes === 60) {
            photoHours += 1;
            photoMinutes = 0;
        }   
        var photoTimeString = (photoHours > 0 ? photoHours + " godz. " : "") + photoMinutes.toString().padStart(2, "0") + " min.";

        var totalMinutes = timeFromWalking + totalPhotoMinutes;
        if (isNaN(totalMinutes) || totalMinutes <= 0) totalMinutes = 0;

        var totalHours = Math.floor(totalMinutes / 60);
        var totalRemainingMinutes = Math.round(totalMinutes % 60);
        if (totalRemainingMinutes === 60) {
            totalHours += 1;
            totalRemainingMinutes = 0;
        }
        
        var totalTimeString = (totalHours > 0 ? totalHours + " godz. " : "") + totalRemainingMinutes.toString().padStart(2, "0") + " min.";
        var totalNumOfPhotos = numOfPhotos * photoMarkersCount;

        document.getElementById("planning-result").style.display = "block";
        document.getElementById("estimated-with-photos").textContent = "Łączny czas: " + totalTimeString;
        document.getElementById("estimated-for-photos").innerHTML = "(w tym zdjęcia: <b>" + photoTimeString + "</b>)";
        document.getElementById("num-of-stations").textContent = "Liczba stanowisk: " + photoMarkersCount;
        document.getElementById("num-of-photos").innerHTML = "(w tym: <b>" + totalNumOfPhotos + " zdjęć</b>)";
    } else {
        document.getElementById("planning-result").style.display = "none";
        document.getElementById("estimated-with-photos").textContent = "-";
        document.getElementById("estimated-for-photos").textContent = "-";
    }
}