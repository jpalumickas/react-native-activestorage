# React Native ActiveStorage

Use direct upload for uploading files to Rails ActiveStorage.

## Installation

Install this package and [rn-fetch-blob](rn-fetch-blob)

```sh
yarn add react-native-activestorage rn-fetch-blob
```

## Usage

```js
import { directUpload } from 'react-native-activestorage'

const file = {
  name: 'image.jpg',
  size: 123456,
  type: 'image/jpeg',
  path: '/var/lib/...'
}

const directUploadsUrl = 'https://localhost:3000/rails/active_storage/direct_uploads';

directUpload({ file, directUploadsUrl }, ({ status, progress, cancel }) => {
  // status - waiting/progress/finished/error
  // progress - 0-100%
  // cancel - function to stop uploading a file
});
```

Use with React Component

```jsx
import DirectUpload from 'react-native-activestorage'

const directUploadsUrl = 'https://localhost:3000/rails/active_storage/direct_uploads';

const Upload = () => (
  <DirectUpload directUploadsUrl={directUploadUrl} onSuccess={({ signedIds }) => console.warn({ signedIds })}>
    {({ handleUpload, uploading, uploads }) => (
      <View>
        <View onClick={() => showPicker(handleUpload)}>
          <Text>Upload</Text>
        </View>
        {uploads.map(upload => <UploadItem upload={upload} key={upload.id} />)}
      </View>
    )}
  </DirectUpload>
)
```

## License

The package is available as open source under the terms of the [MIT License][license].

[license]: https://raw.githubusercontent.com/jpalumickas/react-native-activestorage/master/LICENSE
[rn-fetch-blob]: https://github.com/joltup/rn-fetch-blob
