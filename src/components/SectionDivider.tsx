import useInView from '../hooks/useInView';

export default function SectionDivider({ delay = 0 }: { delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <div className={`section-divider${inView ? ' drawn' : ''}`} ref={ref} style={{ transitionDelay: `${delay}ms` }} />
  );
}
