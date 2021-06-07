# React Native ActiveStorage

Use direct upload for uploading files to Rails ActiveStorage.

## Installation

Install this package and [rn-fetch-blob](rn-fetch-blob)

```sh
yarn add react-native-activestorage rn-fetch-blob
```

## Usage

### Add Active Storage provider

```jsx
import { ActiveStorageProvider } from 'react-native-activestorage'

const App = () => (
  <ActiveStorageProvider host="https://localhost:4000">
    <Navigation />
  </ActiveStorageProvider>
)
```

You can provide `mountPath` to provider if you have different than `/rails/active_storage`

### Use with React Hooks

```jsx
import { useDirectUpload } from 'react-native-activestorage'

const Upload = () => {
  const onSuccess = ({ signedIds }) => {
    // Do something;
  }

  const { upload, uploading, uploads } = useDirectUpload({ onSuccess });

  const onUploadButtonClick = async () => {
    const files = await showPicker();
    const { signedIds } = await upload(files);
    // Assign signed IDs
  }

  return (
    <View>
      <View onClick={onUploadButtonClick}>
        <Text>Upload</Text>
      </View>

      {uploads.map(upload => (
        <UploadItem upload={upload} key={upload.id} />
      ))}
    </View>
  )
}
```

### Use with React Component

```jsx
import { DirectUpload } from 'react-native-activestorage'

const Upload = () => (
  <DirectUpload onSuccess={({ signedIds }) => console.warn({ signedIds })}>
    {({ upload, uploading, uploads }) => (
      <View>
        <View onClick={() => showPicker((files) => upload(files))}>
          <Text>Upload</Text>
        </View>
        {uploads.map(upload => <UploadItem upload={upload} key={upload.id} />)}
      </View>
    )}
  </DirectUpload>
)
```

### Use `directUpload` without React

```js
import { directUpload } from 'react-native-activestorage'

const file = {
  name: 'image.jpg',
  size: 123456,
  type: 'image/jpeg',
  path: '/var/lib/...'
}

const directUploadsUrl = 'https://localhost:3000/rails/active_storage/direct_uploads';

const onStatusChange = ({ status, progress, cancel }) => {
  // status - waiting/uploading/success/error/canceled
  // progress - 0-100% (for uploading status)
  // cancel - function to stop uploading a file
}

directUpload({ file, directUploadsUrl, onStatusChange });
```

## License

The package is available as open source under the terms of the [MIT License][license].

[license]: https://raw.githubusercontent.com/jpalumickas/react-native-activestorage/master/LICENSE
[rn-fetch-blob]: https://github.com/joltup/rn-fetch-blob
