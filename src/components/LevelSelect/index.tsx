import './index.scss';
import { useState } from 'react';
import { LevelData, LevelMetaData, LevelSolutionData, LevelWordData, UnidentifiedLevelMetaData } from '~/components/Level/types';
import LevelCard from '~/components/LevelCard';

function levelIdFromFilepath(filepath: string) {
  return filepath.split('/').at(-2) ?? '';
}

const levels = Object.entries(import.meta.glob<UnidentifiedLevelMetaData>('~/data/levels/*/meta.json', { eager: true }))
  .map(([filepath, data]): LevelMetaData => ({ ...data, id: levelIdFromFilepath(filepath) }))
  .sort((a, b) => a.id < b.id ? -1 : 1);
const levelImportersById = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: LevelWordData }>('~/data/levels/*/level.json'))
    .map(([filepath, importer]) => [levelIdFromFilepath(filepath), importer])
);

export default function LevelSelect(props: {
  levelData?: { [levelId: string]: LevelSolutionData };
  onSelectLevel: (level: LevelData) => void;
}) {
  const [loading, setLoading] = useState(false);

  function selectLevel(level: LevelMetaData) {
    if (!loading) {
      setLoading(true);
      levelImportersById[level.id]()
        .then(({ default: words }) => {
          setLoading(false);
          props.onSelectLevel({ ...level, words });
        });
    }
  }

  return (
    <div className="LevelSelect">
      <div className="LevelSelect-list">
        {levels.map(level => (
          <div
            className="LevelSelect-card"
            key={level.id}
          >
            <LevelCard
              description={level.description}
              name={level.name}
              onSelect={() => selectLevel(level)}
              size={level.size}
              solutionData={props.levelData?.[level.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}