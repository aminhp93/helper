import React, { Component } from "react";
import axios from "axios";

class RealEstate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div>Rever</div>;
  }

  componentDidMount() {
    // axios({
    //   method: 'post',
    //   url: 'https://vinhomes.vn/real-api?type=searchByFilter',
    //   data: 'pageOptions%5Bpage%5D=1&pageOptions%5Bitems_per_page%5D=6&searchOptions%5Bcurrent_category%5D=&searchOptions%5Bacreage%5D=&searchOptions%5BprovinceId%5D=1&searchOptions%5BroomNumber%5D=%3D1&searchOptions%5BproductType%5D=&searchOptions%5BcategoryID%5D=0',
    //   headers: {
    //     'X-CSRF-TOKEN': 'nY87L69lNXp7hk7Ya2HRHtv6CEpaf1Ybdgrki7Mz',
    //     'Host': 'vinhomes.vn',
    //     'X-Requested-With': 'XMLHttpRequest',
    //     'Connection': 'keep-alive',
    //     'Content-Length': '253',
    //     'Cookie': '_ga=GA1.2.330112324.1558509220; _gid=GA1.2.837754794.1558509220; _fbp=fb.1.1558509220773.1596952208; cookie-policy=true; _v1EmaticSolutions=%5B%2220d74ca3-7c61-11e9-b7b9-0242ac160003%22%2C1558509419058%2C%5B%22A%22%2C%22Xem%20th%C3%AAm%22%2C1%5D%5D; XSRF-TOKEN=eyJpdiI6IlpGZytFeDcxajBOalRRWTVRMHpWQWc9PSIsInZhbHVlIjoiTmM3NkVVNnZSNnRBQkFMTWRYTkRcL2loQTdXUllBY0tGcjUzVStvYmM2bVV6Q2JKbWt6cG9kVWhEdXFkUTBhOWtXXC91cjhYVFNNYmNVNmxNTGlZSXhKUT09IiwibWFjIjoiZjdkNjA3NDJhNzkwZjRiOTI0ODk3Y2E4OTQ5NDJlZDA0MmU2ZDliYTVkMzdjMmU4Njk1ODYzMmNhMTA1ODhjNCJ9; laravel_session=eyJpdiI6Ikh3cUNtRTJmbUIzV2NjK1BZcXNLY1E9PSIsInZhbHVlIjoiaDNjNGlheGlITkRQOThNTk9lcU9SQ3BBTGhwV2RsRUVBOEl0VDJqSlZ5NGRLT0x5UE1hNGtPOElmNjFubVB1VEYwSFFETFNNQjliZDBcLzhPWnpJMmtnPT0iLCJtYWMiOiI0ZjBjOWE4NTU3ZmJlYzc0M2Q0Yjg0NjI5OTRkNGM3ZjgxYWNkNWE3NWUxZTg1MjllMjJlZGI2MzIwZjRmNzllIn0%3D'
    //   }
    // }).then(response => {
    //   console.log(response)
    // }).catch(error => {
    //   console.log(error)
    // })
    axios
      .get(
        "https://www.luxstay.com/api/search/popular-location?path=%2Fvietnam%2Fha-noi&type=project&limit=10"
      )
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default RealEstate;
