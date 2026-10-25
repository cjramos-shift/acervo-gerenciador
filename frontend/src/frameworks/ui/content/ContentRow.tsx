import { Link } from 'react-router'
import type { ContentCardModel } from '../../../interface-adapters/presenters/contentCardPresenter'
import { paths } from '../../routing/paths'
import { Badge } from '../design-system/Badge'
import { Icon, type IconName } from '../design-system/Icon'
import styles from './contentRow.module.css'

const INDICATOR_ICONS: Record<ContentCardModel['indicators'][number]['kind'], IconName> = {
  links: 'link',
  images: 'image',
  files: 'file',
}

export function ContentRow({ card }: { card: ContentCardModel }) {
  return (
    <li>
      <article className={styles.row}>
        <p className={styles.path}>
          <span>{card.groupName}</span>
          <Icon name="chevronRight" size={14} />
          <Badge tone="category">{card.categoryName}</Badge>
        </p>
        <h3 className={styles.title}>
          <Link to={paths.content(card.id)} className={styles.titleLink}>
            {card.title}
          </Link>
        </h3>
        {card.excerpt && <p className={styles.excerpt}>{card.excerpt}</p>}
        <div className={styles.footer}>
          {card.indicators.map((indicator) => (
            <span key={indicator.kind} className={styles.indicator}>
              <Icon name={INDICATOR_ICONS[indicator.kind]} size={16} />
              {indicator.label}
            </span>
          ))}
          <span>Atualizado em {card.updatedAtLabel}</span>
        </div>
      </article>
    </li>
  )
}
