import React, { Component } from 'react';
import directUpload from './directUpload';

export default class DirectUploadProvider extends Component {
  state = {
    uploading: false,
    fileUploads: {},
  }

  handleUpload = async (files) => {
    if (this.state.uploading) return
    const { directUploadsUrl, onSuccess } = this.props

    this.setState({ uploading: true })

    const signedIds = await Promise.all(
      files.map(file => directUpload({ file, directUploadsUrl }, this.handleChangeFileUpload))
    )

    const validIds = signedIds.filter(it => it);
    if (validIds.length > 0) { onSuccess(validIds); }

    this.setState({ uploading: false })
  }

  handleChangeFileUpload = (fileUpload) => {
    const newObj = { [fileUpload.id]: fileUpload }
    this.setState(({ fileUploads }) => ({
      fileUploads: { ...fileUploads, ...newObj },
    }))
  }

  render() {
    const { children } = this.props;
    const { fileUploads } = this.state;

    return children({
      handleUpload: this.handleUpload,
      uploading: this.state.uploading,
      uploads: Object.keys(fileUploads).map(key => fileUploads[key]),
    })
  }
}
