import { useState } from 'react'
import type { FileAttachment, ImageAttachment, ReferenceLink } from '../../../domain/entities/content'
import { formatFileSize } from '../../../interface-adapters/presenters/fileSizePresenter'
import { Button } from '../design-system/Button'
import { buttonClassName } from '../design-system/buttonStyles'
import { Dialog } from '../design-system/Dialog'
import { Icon } from '../design-system/Icon'
import styles from './attachments.module.css'

export function ReferenceLinkList({ links }: { links: ReferenceLink[] }) {
  return (
    <ul className={styles.list}>
      {links.map((link) => (
        <li key={link.id} className={styles.item}>
          <div className={styles.itemMain}>
            <span className={styles.itemTitle}>{link.label ?? link.url}</span>
            {link.label && <span className={styles.itemMeta}>{link.url}</span>}
          </div>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName('secondary')}
            aria-label={`Abrir ${link.label ?? link.url} em nova aba`}
          >
            <Icon name="link" size={18} />
            Abrir
          </a>
        </li>
      ))}
    </ul>
  )
}

export function FileList({ files }: { files: FileAttachment[] }) {
  return (
    <ul className={styles.list}>
      {files.map((file) => (
        <li key={file.id} className={styles.item}>
          <div className={styles.itemMain}>
            <span className={styles.itemTitle}>{file.fileName}</span>
            <span className={styles.itemMeta}>{formatFileSize(file.sizeInBytes)}</span>
          </div>
          <a
            href={file.url}
            download={file.fileName}
            className={buttonClassName('secondary')}
            aria-label={`Baixar ${file.fileName}`}
          >
            <Icon name="download" size={18} />
            Baixar
          </a>
        </li>
      ))}
    </ul>
  )
}

const altTextOf = (image: ImageAttachment) => image.description ?? image.fileName

export function ImageGallery({ images }: { images: ImageAttachment[] }) {
  const [selected, setSelected] = useState<ImageAttachment | null>(null)

  return (
    <>
      <ul className={styles.gallery}>
        {images.map((image) => (
          <li key={image.id}>
            <button
              type="button"
              className={styles.thumb}
              aria-label={`Ampliar imagem: ${altTextOf(image)}`}
              onClick={() => setSelected(image)}
            >
              <img src={image.url} alt="" loading="lazy" />
            </button>
            <p className={styles.caption}>{altTextOf(image)}</p>
          </li>
        ))}
      </ul>

      <Dialog
        isOpen={selected !== null}
        title={selected ? altTextOf(selected) : 'Imagem'}
        onClose={() => setSelected(null)}
        actions={<Button onClick={() => setSelected(null)}>Fechar</Button>}
      >
        {selected && <img className={styles.preview} src={selected.url} alt={altTextOf(selected)} />}
      </Dialog>
    </>
  )
}
