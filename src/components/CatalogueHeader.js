import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import MenuDrawer from 'components/MenuDrawer';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import PropTypes from 'prop-types';

const CatalogueHeader = ({
  sourceIndex, sources, searchQuery, onSourceChange, onSearchChange,
}) => (
  <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
    <Toolbar>
      <MenuDrawer />

      <form onSubmit={e => e.preventDefault()}>
        <FormControl>
          <Select value={sourceIndex} onChange={onSourceChange}>
            {sources.map((source, index) => (
              <MenuItem value={index} key={source.id}>
                {source.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField label="Search" value={searchQuery} onChange={onSearchChange} />
      </form>
    </Toolbar>
  </AppBar>
);

CatalogueHeader.propTypes = {
  sourceIndex: PropTypes.number.isRequired,
  sources: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,

  onSourceChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default CatalogueHeader;