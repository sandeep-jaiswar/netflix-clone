import React from 'react';
import { Container, Text, Heading } from '@/components/atoms';
import Link from 'next/link';

const footerSections = [
  {
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/help-center', label: 'Help Center' },
      { href: '/account', label: 'Account' },
      { href: '/media-center', label: 'Media Center' },
    ],
  },
  {
    links: [
      { href: '/investor-relations', label: 'Investor Relations' },
      { href: '/jobs', label: 'Jobs' },
      { href: '/ways-to-watch', label: 'Ways to Watch' },
      { href: '/terms-of-use', label: 'Terms of Use' },
    ],
  },
  {
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/cookie-preferences', label: 'Cookie Preferences' },
      { href: '/corporate-information', label: 'Corporate Information' },
      { href: '/contact-us', label: 'Contact Us' },
    ],
  },
    {
    links: [
      { href: '/speed-test', label: 'Speed Test' },
      { href: '/legal-notices', label: 'Legal Notices' },
      { href: '/only-on-netflix', label: 'Only on Netflix' },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="py-12 md:py-16 bg-[var(--color-netflix-black)] text-[var(--text-secondary)] mt-10">
      <Container>
        <div className="mb-8">
          <Link href="/contact-us-main" legacyBehavior={false}>
            <Text as="span" className="hover:underline cursor-pointer text-lg">
              Questions? Contact us.
            </Text>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 text-sm">
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              {section.links.map((link) => (
                <Link key={link.href} href={link.href} legacyBehavior={false}>
                  <Text
                    as="span"
                    variant="small"
                    className="block hover:underline cursor-pointer"
                  >
                    {link.label}
                  </Text>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Text variant="small" className="border border-[var(--text-secondary)] rounded px-3 py-1.5 inline-block">
            English
          </Text>
        </div>

        <Text variant="small" className="mt-6">
          Netflix Clone ({new Date().getFullYear()})
        </Text>
      </Container>
    </footer>
  );
};

export default Footer;
