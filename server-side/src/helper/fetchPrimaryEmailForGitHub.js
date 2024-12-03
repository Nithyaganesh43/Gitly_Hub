const axios = require("axios");
async function fetchPrimaryEmail(accessToken) {
    try {
      const response = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primaryEmail = response.data.find(email => email.primary && email.verified);
      return primaryEmail ? primaryEmail.email : "No email found";
    } catch (error) {
      console.error("Error fetching GitHub email:", error);
      return "No email found";
    }
}
module.exports=fetchPrimaryEmail;