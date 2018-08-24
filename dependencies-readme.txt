####################
# native plugins
####################

	1. Geolocation
		$ ionic cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="To locate you"
		$ npm install --save @ionic-native/geolocation
		import { Geolocation } from '@ionic-native/geolocation';

	2. Camera
		$ ionic cordova plugin add cordova-plugin-camera
		$ npm install --save @ionic-native/camera
		import { Camera } from '@ionic-native/camera';

	3. File
		$ ionic cordova plugin add cordova-plugin-file
		$ npm install --save @ionic-native/file
		import { File } from '@ionic-native/file';

		$ ionic cordova plugin add cordova-plugin-file-transfer
		$ npm install --save @ionic-native/file-transfer
		import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

	4. Storage
		$ ionic cordova plugin add cordova-sqlite-storage
		$ npm install --save @ionic/storage
		$ import { IonicStorageModule } from '@ionic/storage';

	5. Sqlite
		$ ionic cordova plugin add cordova-sqlite-storage
		$ npm install --save @ionic-native/sqlite
		import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

	6. Google Plus
		$ ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=myreversedclientid
		$ npm install --save @ionic-native/google-plus
		import { GooglePlus } from '@ionic-native/google-plus';



####################
# npm packages
####################
	1. GoogleMaps
		$ npm install --save @agm/core
		$ import { AgmCoreModule } from '@agm/core';

	2. Leaflet
		$ npm install --save leaflet


####################
# appmodule.ts imports
####################
import { Geolocation } from '@ionic-native/geolocation'; 
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AgmCoreModule } from '@agm/core';
import { IonicStorageModule } from '@ionic/storage';

AgmCoreModule.forRoot({ apiKey: 'AIzaSyDVW6LSgynAbnYKwBql_oHPmEFrardyyAM'}),
IonicStorageModule.forRoot()