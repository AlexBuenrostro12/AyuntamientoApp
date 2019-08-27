import FirebaseConstants from './FirebaseConstants';
import { Alert } from 'react-native';

const API_URL = 'https://fcm.googleapis.com/fcm/send';

class FirebaseClient {
	async send(body, type) {
		if (FirebaseConstants.KEY === 'YOUR_API_KEY') {
			Alert.alert('Set your API_KEY in app/FirebaseConstants.js');
			return;
		}
		let headers = new Headers({
			'Content-Type': 'application/json',
			Authorization: 'key=' + FirebaseConstants.KEY
		});

		try {
			let response = await fetch(API_URL, { method: 'POST', headers, body });
			console.log(response);
			try {
				response = await response.json();
				console.log('NotificationResponse: ', response);
				if (!response.success) {
					Alert.alert('Failed to send notification, check error log');
				}
			} catch (err) {
				console.log('NotificationErr: ', err);
				Alert.alert('Failed to send notification, check error log');
			}
		} catch (err) {
			console.log('err: ', err, err.message);
			Alert.alert(err && err.message);
		}
	}
}

let firebaseClient = new FirebaseClient();
export default firebaseClient;
