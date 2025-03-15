class UserData {
  constructor(data) {
    this.id = data.id;
    this.userInfos = data.userInfos;
    // Standardisation du score (peut être todayScore ou score) et conversion en pourcentage
    const rawScore = data.score || data.todayScore || 0;
    this.score = rawScore * 100;
    this.keyData = data.keyData;
  }
}

export default UserData;