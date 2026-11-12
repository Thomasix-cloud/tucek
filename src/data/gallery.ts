import type { ImageMetadata } from 'astro';
import brzdy from '../assets/placeholder/brzdy.jpg';
import motorDetail from '../assets/placeholder/motor-detail.jpg';
import mechanikDetail from '../assets/placeholder/mechanik-detail.jpg';
import zvedak from '../assets/placeholder/zvedak.jpg';
import kotouc from '../assets/placeholder/kotouc.jpg';
import audi from '../assets/placeholder/audi.jpg';
import motor from '../assets/placeholder/motor.jpg';
import pneuSklad from '../assets/placeholder/pneu-sklad.jpg';
import brzdyDetail from '../assets/placeholder/brzdy-detail.jpg';

/**
 * TODO: nahradit reálnými fotkami klienta (vložit do src/assets/gallery/ a upravit importy).
 * Placeholdery: Unsplash (Unsplash License).
 */
export interface GalleryItem {
  src: ImageMetadata;
  alt: string;
}

export const gallery: GalleryItem[] = [
  { src: brzdy, alt: 'Detail brzdového třmenu a kotouče' },
  { src: mechanikDetail, alt: 'Mechanik kontroluje podvozek vozu' },
  { src: motorDetail, alt: 'Detail motorového prostoru' },
  { src: zvedak, alt: 'Mechanik pod vozem na zvedáku' },
  { src: kotouc, alt: 'Brzdový kotouč po sundání kola' },
  { src: audi, alt: 'Logo Audi na fasádě' },
  { src: motor, alt: 'Motor osobního automobilu' },
  { src: pneuSklad, alt: 'Pneumatiky připravené k přezutí' },
  { src: brzdyDetail, alt: 'Sportovní brzdový kotouč' },
];
